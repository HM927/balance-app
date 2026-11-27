import { test, expect, API_URL } from "./fixtures.js";

const transactions = [
    { type: "expense", amount: 2000, date: "2026-11-12", memo: "食費" },
    { type: "income", amount: 3000, date: "2026-11-11", memo: "11月の給料" },
    { type: "expense", amount: 500, date: "2026-11-11", memo: "給料日の昼食" },
    { type: "income", amount: 1000, date: "2026-11-13", memo: "返金" }
];

test.beforeEach(async ({ request }) => {
    for (const transaction of transactions) {
        const response = await request.post(`${API_URL}/transactions`, { data: transaction });
        expect(response.ok()).toBeTruthy();
    }
});

const cases = [
    { name: "条件なしは日付・同日ID順で全件取得", params: {}, expected: ["11月の給料", "給料日の昼食", "食費", "返金"] },
    { name: "収入のみ", params: { type: "income" }, expected: ["11月の給料", "返金"] },
    { name: "支出のみ", params: { type: "expense" }, expected: ["給料日の昼食", "食費"] },
    { name: "メモの部分一致", params: { keyword: "給料" }, expected: ["11月の給料", "給料日の昼食"] },
    { name: "収入とメモをANDで検索", params: { type: "income", keyword: "給料" }, expected: ["11月の給料"] },
    { name: "支出とメモをANDで検索", params: { type: "expense", keyword: "給料" }, expected: ["給料日の昼食"] },
    { name: "空文字の条件は全件取得", params: { type: "", keyword: "" }, expected: ["11月の給料", "給料日の昼食", "食費", "返金"] },
    { name: "空白だけのキーワードは絞り込まない", params: { type: "expense", keyword: "  " }, expected: ["給料日の昼食", "食費"] },
    { name: "一致しなければ空配列", params: { keyword: "家賃" }, expected: [] },
    { name: "引用符を含む入力はSQLとして実行されない", params: { keyword: "' OR 1=1 --" }, expected: [] }
];

for (const { name, params, expected } of cases) {
    test(name, async ({ request }) => {
        const response = await request.get(`${API_URL}/transactions`, { params });
        expect(response.status()).toBe(200);
        const result = await response.json();
        expect(result.map(transaction => transaction.memo)).toEqual(expected);
        const sameDay = result.filter(transaction => transaction.date === "2026-11-11");
        expect(sameDay.map(transaction => transaction.id)).toEqual(
            sameDay.map(transaction => transaction.id).sort((a, b) => a - b)
        );
    });
}
