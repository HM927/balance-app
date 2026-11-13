export function calculateBalance(baseInfo, transactions, targetDate) {
    let balance = Number(baseInfo.balance);

    transactions.forEach((transaction) => {
        if (transaction.date < baseInfo.baseDate || targetDate < transaction.date) {
            return;
        }

        if (transaction.type === "income") {
            balance += transaction.amount;
        }

        if (transaction.type === "expense") {
            balance -= transaction.amount;
        }
    });

    return balance;
}
