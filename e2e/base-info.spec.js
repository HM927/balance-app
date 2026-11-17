import {test, expect} from "@playwright/test";

test("基準情報を保存・更新でき、再読み込み後も残る", async ({page}) => {
    await page.goto("http://localhost:5173");
    
    await page.locator("#balanceInput").fill("10000");
    await page.locator("#baseDateInput").fill("2026-11-10");
    await page.locator("#saveButton").click();

    await expect(page.locator("#balanceDisplay")).toHaveText("10000");
    await expect(page.locator("#baseDateDisplay")).toHaveText("2026-11-10");

    await page.reload();

    await expect(page.locator("#balanceDisplay")).toHaveText("10000");
    await expect(page.locator("#baseDateDisplay")).toHaveText("2026-11-10");

    await page.locator("#balanceInput").fill("20000");
    await page.locator("#baseDateInput").fill("2026-11-11");
    await page.locator("#saveButton").click();

    await expect(page.locator("#balanceDisplay")).toHaveText("20000");
    await expect(page.locator("#baseDateDisplay")).toHaveText("2026-11-11");

    await page.reload();
    
    await expect(page.locator("#balanceDisplay")).toHaveText("20000");
    await expect(page.locator("#baseDateDisplay")).toHaveText("2026-11-11");
});



