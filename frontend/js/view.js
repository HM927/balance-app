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

export function showTransactions(transactions, onDelete) {
    const list = document.getElementById("transactionList");
    const count = document.getElementById("transactionCount");
    const emptyMessage = document.getElementById("transactionEmptyMessage");

    list.replaceChildren();

    transactions.forEach(transaction => {
        const listItem = createTransactionListItem(transaction);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "削除";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", async () => {
            await onDelete(transaction.id);
        });

        listItem.appendChild(deleteButton);
        list.appendChild(listItem);
    });

    count.textContent = `${transactions.length}件`;
    emptyMessage.hidden = transactions.length !== 0;
}