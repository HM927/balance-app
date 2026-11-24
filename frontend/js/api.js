export async function fetchTransactions() {
    const response = await fetch("http://localhost:8080/transactions");

    if (!response.ok) {
        throw new Error("収支の取得に失敗しました");
    }

    return response.json();
    
}

export async function addTransaction(transaction) {
    const response = await fetch("http://localhost:8080/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: transaction.type,
            amount: transaction.amount,
            date: transaction.date,
            memo: transaction.memo,
        }),
    });

    if (!response.ok) {
        throw new Error("収支の登録に失敗しました");
    }
}

export async function deleteTransaction(id) {
    const response = await fetch(`http://localhost:8080/transactions/${id}`, 
    { method: "DELETE" }
    );

    if (response.status === 404) {
        throw new Error("対象の収支が見つかりません");
    }

    if (!response.ok) {
        throw new Error("収支の削除に失敗しました");
    }
}

export async function fetchBaseInfo() {
    const response = await fetch("http://localhost:8080/base-info");

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("残高の取得に失敗しました");
    }

    return response.json()
}

export async function saveBaseInfo(baseInfo) {
    const response = await fetch("http://localhost:8080/base-info", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            balance: baseInfo.balance,
            baseDate: baseInfo.baseDate,
        }),
    });

    if(!response.ok) {
        throw new Error("基準情報の保存に失敗しました");
    }
}