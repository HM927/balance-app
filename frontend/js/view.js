export function showCalculatedBalance(balance) {
    const calculatedBalanceDisplay = document.getElementById("calculatedBalanceDisplay");
    
    calculatedBalanceDisplay.textContent = `${balance}円`;
}

export function createTransactionListItem(transaction) {
    const listItem = document.createElement("li");
    listItem.classList.add("transaction-item", transaction.type);

    const typeText = transaction.type === "income" ? "収入" : "支出";

    const transactionText = document.createElement("span");
    transactionText.classList.add("transaction-details");

    const dateText = document.createElement("span");
    dateText.classList.add("transaction-date");
    dateText.textContent = transaction.date;

    const typeLabel = document.createElement("span");
    typeLabel.classList.add("transaction-type");
    typeLabel.textContent = typeText;

    const amountText = document.createElement("span");
    amountText.classList.add("transaction-amount");
    amountText.textContent = `${transaction.amount}円`;

    const memoText = document.createElement("span");
    memoText.classList.add("transaction-memo");
    memoText.textContent = transaction.memo;

    transactionText.appendChild(dateText);
    transactionText.appendChild(typeLabel);
    transactionText.appendChild(amountText);
    transactionText.appendChild(memoText);

    listItem.appendChild(transactionText);

    return listItem;
}

export function showSelectedTransactions(transactions) {
        const list = document.getElementById("selected-date-transactionList");
        list.innerHTML = "";
    
        transactions.forEach((transaction) => {
            const listItem = createTransactionListItem(transaction);
    
            list.appendChild(listItem);
        });
}