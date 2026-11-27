// 普段のDBには接続せず、一時PostgreSQLとSpring Bootをテスト専用に起動する。
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const temporaryDirectory = mkdtempSync(join(tmpdir(), "balance-app-e2e-"));
const dataDirectory = join(temporaryDirectory, "data");
let databaseStarted = false;
let backend;
let stopping = false;

function cleanup() {
    if (databaseStarted) {
        execFileSync("pg_ctl", ["-D", dataDirectory, "-m", "immediate", "-w", "stop"], {
            stdio: "ignore"
        });
        databaseStarted = false;
    }
    rmSync(temporaryDirectory, { recursive: true, force: true });
}

function stop(signal) {
    if (stopping) return;
    stopping = true;
    if (!backend) {
        cleanup();
        process.exit(0);
    }
    process.kill(-backend.pid, signal);
    // Gradleと、その子のJavaプロセスをまとめて終了する。
    setTimeout(() => {
        try { process.kill(-backend.pid, "SIGKILL"); } catch {}
    }, 5000).unref();
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));

try {
    const socket = createServer();
    await new Promise(resolve => socket.listen(0, "127.0.0.1", resolve));
    const port = socket.address().port;
    await new Promise(resolve => socket.close(resolve));

    execFileSync("initdb", [
        "-D", dataDirectory, "-U", "balance_e2e", "-A", "trust",
        "--no-locale", "--encoding=UTF8"
    ], { stdio: "ignore" });
    const logFile = join(temporaryDirectory, "postgres.log");
    execFileSync("pg_ctl", [
        "-D", dataDirectory, "-l", logFile, "-w", "start",
        "-o", `-h 127.0.0.1 -p ${port} -k ${temporaryDirectory}`
    ], { stdio: "pipe" });
    databaseStarted = true;

    execFileSync("psql", [
        "-h", "127.0.0.1", "-p", String(port), "-U", "balance_e2e",
        "-d", "postgres", "-v", "ON_ERROR_STOP=1",
        "-f", join(root, "scripts/e2e-schema.sql")
    ], { stdio: "pipe" });

    backend = spawn("./gradlew", ["bootRun", "--args=--server.port=18080"], {
        cwd: join(root, "backend"),
        detached: true,
        stdio: "inherit",
        env: {
            ...process.env,
            SPRING_DATASOURCE_URL: `jdbc:postgresql://127.0.0.1:${port}/postgres`,
            SPRING_DATASOURCE_USERNAME: "balance_e2e",
            SPRING_DATASOURCE_PASSWORD: "",
            DB_PASSWORD: ""
        }
    });
    backend.on("error", error => {
        console.error(error);
        cleanup();
        process.exit(1);
    });
    backend.on("exit", code => {
        cleanup();
        process.exit(stopping ? 0 : (code ?? 1));
    });
} catch (error) {
    console.error("テスト用DBの起動に失敗しました。initdb・pg_ctl・psqlをPATHに用意してください。", error.message);
    const logFile = join(temporaryDirectory, "postgres.log");
    try { console.error(readFileSync(logFile, "utf8")); } catch {}
    cleanup();
    process.exit(1);
}
