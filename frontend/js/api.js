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
