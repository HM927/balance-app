import test from "node:test";
import assert from "node:assert/strict";
import {calculateBalance} from "../balance.js";
import {deleteTransaction} from "../transactions.js";
import {saveTransactions} from "../storage.js";

//残高計算
test("収入のみ", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };

    const transaction = [
        {
            id: 1,
            date: "2026-11-11",
            type: "income",
            amount: 3000
        }
    ];

    const actual = calculateBalance(
        baseInfo, 
        transaction, 
        "2026-11-12"
    );

    assert.strictEqual(actual, 13000);
});

test("支出のみ", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };

    const transaction = [
        {
            id: 1,
            date: "2026-11-11",
            type:"expense",
            amount: 2000
        }
    ];

    const actual = calculateBalance(
        baseInfo,
        transaction,
        "2026-11-12"
    );

    assert.strictEqual(actual, 8000);
});

test("収入と支出", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };

    const transactions = [
        {
            id: 1,
            date: "2026-11-11",
            type: "income",
            amount: 3000
        },
        {
            id: 2,
            date: "2026-11-12",
            type: "expense",
            amount: 2000
        }
    ];

    const actual = calculateBalance(
        baseInfo,
        transactions,
        "2026-11-12"
    );

    assert.strictEqual(actual, 11000);
})

test("収入なし", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };

    const acual = calculateBalance(
        baseInfo,
        [],
        "2026-11-12"
    );

    assert.strictEqual(acual, 10000);
})

test("基準日の前日の収入", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };
    
    const transaction = [
        {
            id: 1,
            date: "2026-11-09",
            type: "income",
            amount: 3000
        }
    ];

    const actual = calculateBalance(
        baseInfo,
        transaction,
        "2026-11-12"
    );

    assert.strictEqual(actual, 10000);
})

test("基準日当日の収入", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };

    const transaction = [
        {
            id: 1,
            date: "2026-11-10",
            type: "income",
            amount: 3000
        }
    ];

    const actual = calculateBalance(
        baseInfo,
        transaction,
        "2026-11-10"
    );

    assert.strictEqual(actual, 13000);
});

test("確認日当日の支出", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-12"
    };

    const transaction = [{
        id: 1,
        date: "2026-11-12",
        type: "expense",
        amount: 2000
    }];

    const actual = calculateBalance(
        baseInfo,
        transaction,
        "2026-11-12"
    );

    assert.strictEqual(actual, 8000);
})

test("残高が0円", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };

    const transaction = [{
        id: 1,
        date: "2026-11-11",
        type: "expense",
        amount: 10000
    }];

    const actual = calculateBalance(
        baseInfo,
        transaction,
        "2026-11-12"
    );

    assert.strictEqual(actual, 0);
});

test("残高がマイナス", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };

    const transaction = [{
        id: 1,
        date: "2026-11-11",
        type: "expense",
        amount: 10001
    }];

    const actual = calculateBalance(
        baseInfo,
        transaction,
        "2026-11-12"
    );

    assert.strictEqual(actual, -1);
});

test("同じ日に複数件", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };

    const transactions = [
        {
            id: 1,
            date: "2026-11-11",
            type: "income",
            amount: 3000
        },
        {
            id: 2,
            date: "2026-11-11",
            type: "expense",
            amount: 500
        },
        {
            id: 3,
            date: "2026-11-11",
            type: "expense",
            amount: 1000
        }
    ];

    const actual = calculateBalance(
        baseInfo,
        transactions,
        "2026-11-12"
    );

    assert.strictEqual(actual, 11500);
});

test("確認日の翌日の収支", () => {
    const baseInfo = {
        balance: 10000,
        baseDate: "2026-11-10"
    };

    const transaction = [{
        id: 1,
        date: "2026-11-13",
        type: "income",
        amount: 3000
    }];

    const actual = calculateBalance(
        baseInfo,
        transaction,
        "2026-11-12"
    ); 

    assert.strictEqual(actual, 10000);
});