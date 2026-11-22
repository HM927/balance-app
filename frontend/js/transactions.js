
export function sortTransactionsByDate(transactions) {
    return [...transactions].sort((a, b) => {
        return a.date.localeCompare(b.date);
    });
}

export function getTransactionsByDate(transactions, targetDate) {
    return transactions.filter(transaction => 
        transaction.date === targetDate
    );
}