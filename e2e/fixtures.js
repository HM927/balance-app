import { test as base, expect } from "@playwright/test";

export const API_URL = "http://localhost:18080";

export const test = base.extend({
    // 1 workerで実行し、テスト専用のAPI・DBだけを初期化する。
    isolatedData: [async ({ request }, use) => {
        const response = await request.get(`${API_URL}/transactions`);
        expect(response.ok()).toBeTruthy();
        for (const transaction of await response.json()) {
            const deleted = await request.delete(`${API_URL}/transactions/${transaction.id}`);
            expect(deleted.status()).toBe(204);
        }
        const saved = await request.put(`${API_URL}/base-info`, {
            data: { balance: 10000, baseDate: "2026-11-10" }
        });
        expect(saved.status()).toBe(204);
        await use();
    }, { auto: true }],

    page: async ({ page }, use) => {
        // 実際の画面コードを使い、通信先だけテスト用Spring Bootに切り替える。
        await page.route("http://localhost:8080/**", async route => {
            const response = await route.fetch({
                url: route.request().url().replace("http://localhost:8080", API_URL)
            });
            await route.fulfill({ response });
        });
        await use(page);
    }
});

export { expect };
