import {test, expect} from "@playwright/test";

test("複数保存でき、削除ができる", async ({page}) => {
await page.clock.install({
    time: new Date("2026-11-15T12:00:00+09:00"),
});

await page.goto("http://localhost:5173");

const nav = page.getByRole("navigation");
await nav.getByRole("button", { name: "設定", exact: true }).click();

await page.locator("#balanceInput").fill("10000");
await page.locator("#baseDateInput").fill("2026-11-10");
await page.locator("#saveButton").click();

await nav.getByRole("button", { name: "収支管理", exact: true }).click();

await page.locator("#transactionType").selectOption("income");
await page.locator("#transactionDate").fill("2026-11-11");
await page.locator("#transactionAmount").fill("3000");
await page.locator("#transactionMemo").fill("給料");
await page.locator("#addTransactionButton").click();

await page.locator("#transactionType").selectOption("expense");
await page.locator("#transactionDate").fill("2026-11-12");
await page.locator("#transactionAmount").fill("2000");
await page.locator("#transactionMemo").fill("食費");
await page.locator("#addTransactionButton").click();

await nav.getByRole("button", { name: "カレンダー", exact: true }).click();

await page.locator(
    '#calendar [data-date="2026-11-12"]'
).click();
await expect(page.locator("#calculatedBalanceDisplay")).toHaveText("11000円");

const list = page.locator("#transactionList");

await expect(list.locator("li")).toHaveCount(2);
await expect(list.locator(".transaction-date")).toHaveText(["2026-11-11", "2026-11-12"]);
await expect(list.locator(".transaction-type")).toHaveText(["収入", "支出"]);
await expect(list.locator(".transaction-amount")).toHaveText(["3000円", "2000円"]);
await expect(list.locator(".transaction-memo")).toHaveText(["給料", "食費"]);

await page.reload();

await nav.getByRole("button", { name: "収支管理", exact: true }).click();

await expect(list.locator("li")).toHaveCount(2);
await expect(list.locator(".transaction-date")).toHaveText(["2026-11-11", "2026-11-12"]);
await expect(list.locator(".transaction-type")).toHaveText(["収入", "支出"]);
await expect(list.locator(".transaction-amount")).toHaveText(["3000円", "2000円"]);
await expect(list.locator(".transaction-memo")).toHaveText(["給料", "食費"]);

await list.locator("li").first().locator(".delete-button").click();

await nav.getByRole("button", { name: "カレンダー", exact: true }).click();

await page.locator(
    '#calendar [data-date="2026-11-12"]'
).click();
await expect(page.locator("#calculatedBalanceDisplay")).toHaveText("8000円");

await expect(list.locator("li")).toHaveCount(1);
await expect(list.locator(".transaction-date")).toHaveText(["2026-11-12"]);
await expect(list.locator(".transaction-type")).toHaveText(["支出"]);
await expect(list.locator(".transaction-amount")).toHaveText(["2000円"]);
await expect(list.locator(".transaction-memo")).toHaveText(["食費"]);

await page.reload();

await nav.getByRole("button", { name: "収支管理", exact: true }).click();

await expect(list.locator("li")).toHaveCount(1);
await expect(list.locator(".transaction-date")).toHaveText(["2026-11-12"]);
await expect(list.locator(".transaction-type")).toHaveText(["支出"]);
await expect(list.locator(".transaction-amount")).toHaveText(["2000円"]);
await expect(list.locator(".transaction-memo")).toHaveText(["食費"]);

await list.locator("li").first().locator(".delete-button").click();

await nav.getByRole("button", { name: "カレンダー", exact: true }).click();

await page.locator(
    '#calendar [data-date="2026-11-12"]'
).click();
await expect(page.locator("#calculatedBalanceDisplay")).toHaveText("10000円");

await expect(list.locator("li")).toHaveCount(0);

await page.reload();

await nav.getByRole("button", { name: "収支管理", exact: true }).click();

await expect(list.locator("li")).toHaveCount(0);
});