import {loadTransactions, saveTransactions} from "./storage.js";

export function sortTransactionsByDate(transactions) {
    return [...transactions].sort((a, b) => {
        return a.date.localeCompare(b.date);
    });
}

// 収支削除
export function deleteTransaction(id) {
    const transactions = loadTransactions();

    const filteredTransactions = transactions.filter((transaction) => {
        return transaction.id !== id;
    });

    saveTransactions(filteredTransactions);
    
    return filteredTransactions;
}