import { test, expect, API_URL } from "./fixtures.js";

test.beforeEach(async ({ page, request }) => {
    const transactions = [
        { type: "expense", amount: 2000, date: "2026-11-12", memo: "食費" },
        { type: "income", amount: 3000, date: "2026-11-11", memo: "11月の給料" },
        { type: "expense", amount: 500, date: "2026-11-11", memo: "給料日の昼食" },
        { type: "income", amount: 1000, date: "2026-11-13", memo: "返金" }
    ];
    for (const transaction of transactions) {
        const response = await request.post(`${API_URL}/transactions`, { data: transaction });
        expect(response.ok()).toBeTruthy();
    }
    await page.clock.install({ time: new Date("2026-11-15T12:00:00+09:00") });
    await page.goto("/");
    await expect(page.locator("#transactionCount")).toHaveText("4件");
    await page.getByRole("navigation").getByRole("button", { name: "収支管理", exact: true }).click();
});

test("すべて・収入・支出を切り替え、件数と選択状態を表示する", async ({ page }) => {
    const tabs = page.getByRole("group", { name: "収支の種別" });
    const memos = page.locator("#transactionList .transaction-memo");
    await expect(memos).toHaveText(["11月の給料", "給料日の昼食", "食費", "返金"]);

    await tabs.getByRole("button", { name: "収入", exact: true }).click();
    await expect(memos).toHaveText(["11月の給料", "返金"]);
    await expect(page.locator("#transactionCount")).toHaveText("2件");
    await expect(tabs.getByRole("button", { name: "収入", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(tabs.getByRole("button", { name: "すべて" })).toHaveAttribute("aria-pressed", "false");

    await tabs.getByRole("button", { name: "支出", exact: true }).click();
    await expect(memos).toHaveText(["給料日の昼食", "食費"]);
    await expect(tabs.getByRole("button", { name: "支出", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(tabs.getByRole("button", { name: "収入", exact: true })).toHaveAttribute("aria-pressed", "false");

    await tabs.getByRole("button", { name: "すべて" }).click();
    await expect(memos).toHaveCount(4);
});

test("部分一致検索と種別を組み合わせ、クリアすると種別のみになる", async ({ page }) => {
    const memos = page.locator("#transactionList .transaction-memo");
    const tabs = page.getByRole("group", { name: "収支の種別" });
    await page.getByLabel("メモを検索").fill(" 給料 ");
    await expect(memos).toHaveText(["11月の給料", "給料日の昼食"]);
    await tabs.getByRole("button", { name: "支出", exact: true }).click();
    await expect(memos).toHaveText(["給料日の昼食"]);
    await expect(page.getByLabel("メモを検索")).toHaveValue(" 給料 ");
    await expect(page.locator("#transactionCount")).toHaveText("1件");
    await page.getByLabel("メモを検索").fill("");
    await expect(memos).toHaveText(["給料日の昼食", "食費"]);
});

test("一致なしでは0件メッセージを表示し、検索解除で戻る", async ({ page }) => {
    await page.getByLabel("メモを検索").fill("家賃");
    await expect(page.locator("#transactionCount")).toHaveText("0件");
    await expect(page.locator("#transactionList li")).toHaveCount(0);
    await expect(page.locator("#transactionEmptyMessage")).toBeVisible();
    expect(await page.locator("#transactionList").evaluate(element =>
        getComputedStyle(element, "::before").content
    )).toBe("none");
    await page.getByLabel("メモを検索").fill("");
    await expect(page.locator("#transactionCount")).toHaveText("4件");
    await expect(page.locator("#transactionEmptyMessage")).toBeHidden();
});

test("追加・削除後も種別と検索語を維持する", async ({ page }) => {
    const tabs = page.getByRole("group", { name: "収支の種別" });
    const memos = page.locator("#transactionList .transaction-memo");
    await tabs.getByRole("button", { name: "支出", exact: true }).click();
    await page.getByLabel("メモを検索").fill("食費");
    await expect(memos).toHaveText(["食費"]);

    await page.locator("#transactionType").selectOption("expense");
    await page.locator("#transactionDate").fill("2026-11-14");
    await page.locator("#transactionAmount").fill("800");
    await page.locator("#transactionMemo").fill("追加の食費");
    await page.locator("#addTransactionButton").click();
    await expect(memos).toHaveText(["食費", "追加の食費"]);

    // 条件に合わない収入も保存されるが、検索結果には混ざらない。
    await page.locator("#transactionType").selectOption("income");
    await page.locator("#transactionMemo").fill("食費の返金");
    const added = page.waitForResponse(response =>
        response.request().method() === "POST" && new URL(response.url()).pathname === "/transactions"
    );
    await page.locator("#addTransactionButton").click();
    expect((await added).ok()).toBeTruthy();
    await expect.poll(async () => {
        const response = await page.request.get(`${API_URL}/transactions`);
        return (await response.json()).length;
    }).toBe(6);
    await expect(memos).toHaveText(["食費", "追加の食費"]);

    await page.locator("#transactionList li").filter({ hasText: "追加の食費" }).getByRole("button", { name: "削除" }).click();
    await expect(memos).toHaveText(["食費"]);
    await expect(page.locator("#transactionCount")).toHaveText("1件");
    await expect(page.getByLabel("メモを検索")).toHaveValue("食費");
    await expect(tabs.getByRole("button", { name: "支出", exact: true })).toHaveAttribute("aria-pressed", "true");

    await page.getByLabel("メモを検索").fill("");
    await tabs.getByRole("button", { name: "すべて" }).click();
    await expect(memos).toHaveCount(5);
    await expect(memos).toContainText(["食費の返金"]);
});

test("一覧の検索条件を変えても残高と日別収支は変化しない", async ({ page }) => {
    const nav = page.getByRole("navigation");
    await nav.getByRole("button", { name: "カレンダー", exact: true }).click();
    await page.locator('#calendar [data-date="2026-11-12"]').click();
    await expect(page.locator("#calculatedBalanceDisplay")).toHaveText("10500円");
    await expect(page.locator("#selected-date-transactionList .transaction-memo")).toHaveText(["食費"]);

    await nav.getByRole("button", { name: "収支管理", exact: true }).click();
    await page.getByRole("group", { name: "収支の種別" }).getByRole("button", { name: "収入", exact: true }).click();
    await page.getByLabel("メモを検索").fill("給料");
    await expect(page.locator("#transactionList .transaction-memo")).toHaveText(["11月の給料"]);
    await nav.getByRole("button", { name: "カレンダー", exact: true }).click();
    await page.locator('#calendar [data-date="2026-11-12"]').click();
    await expect(page.locator("#calculatedBalanceDisplay")).toHaveText("10500円");
    await expect(page.locator("#selected-date-transactionList .transaction-memo")).toHaveText(["食費"]);
});

test("遅れて届いた古い検索結果で最新の結果を上書きしない", async ({ page }) => {
    let release;
    const held = new Promise(resolve => { release = resolve; });
    let markStarted;
    const started = new Promise(resolve => { markStarted = resolve; });
    let markDelivered;
    const delivered = new Promise(resolve => { markDelivered = resolve; });

    await page.route("http://localhost:8080/transactions?*", async route => {
        const url = new URL(route.request().url());
        if (url.searchParams.get("keyword") !== "給") {
            await route.fallback();
            return;
        }
        const response = await route.fetch({ url: `${API_URL}${url.pathname}${url.search}` });
        markStarted();
        await held;
        await route.fulfill({ response });
        markDelivered();
    });

    await page.getByLabel("メモを検索").fill("給");
    await started;
    await page.getByLabel("メモを検索").fill("食費");
    await expect(page.locator("#transactionList .transaction-memo")).toHaveText(["食費"]);
    const oldResponse = page.waitForResponse(response =>
        new URL(response.url()).searchParams.get("keyword") === "給"
    );
    release();
    await delivered;
    await (await oldResponse).finished();
    await page.clock.runFor(50);
    // アプリ側の応答処理が完了した後も、新しい結果を維持する。
    await expect(page.locator("#transactionList .transaction-memo")).toHaveText(["食費"]);
    await expect(page.locator("#transactionCount")).toHaveText("1件");
});
