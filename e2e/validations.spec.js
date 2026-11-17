import {test, expect} from "@playwright/test";

test("日付未入力時", async ({page}) => {
    await page.goto("http://127.0.0.1:8000");

    await page.locator("#transactionType").selectOption("income");
    await page.locator("#transactionAmount").fill("3000");
    await page.locator("#transactionMemo").fill("給料");
    await page.locator("#addTransactionButton").click();

    const list  = page.locator("#transactionList");

    await expect(list.locator("li")).toHaveCount(0);
});

test("金額未入力時", async ({page}) => {
    await page.goto("http://127.0.0.1:8000");

    await page.locator("#transactionType").selectOption("income");
    await page.locator("#transactionDate").fill("2026-11-11");
    await page.locator("#transactionMemo").fill("給料");
    await page.locator("#addTransactionButton").click();

    const list  = page.locator("#transactionList");
    
    await expect(list.locator("li")).toHaveCount(0);
});

test("メモ未入力時", async ({page}) => {
    await page.goto("http://127.0.0.1:8000");

    await page.locator("#transactionType").selectOption("income");
    await page.locator("#transactionDate").fill("2026-11-11");
    await page.locator("#transactionAmount").fill("3000");
    await page.locator("#addTransactionButton").click();

    const list  = page.locator("#transactionList");
    
    await expect(list.locator("li")).toHaveCount(0);
});

test("金額が0円", async ({page}) => {
    await page.goto("http://127.0.0.1:8000");
    
    await page.locator("#transactionType").selectOption("income");
    await page.locator("#transactionDate").fill("2026-11-11");
    await page.locator("#transactionAmount").fill("0");
    await page.locator("#transactionMemo").fill("給料");
    await page.locator("#addTransactionButton").click();

    const list  = page.locator("#transactionList");

    await expect(list.locator("li")).toHaveCount(0);
});