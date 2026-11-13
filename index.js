import {calculateBalance} from "./balance.js";
import {loadBaseInfo, saveBaseInfo, loadTransactions, saveTransactions} from "./storage.js";
import {sortTransactionsByDate, deleteTransaction} from "./transactions.js";

const balanceInput = document.getElementById("balanceInput");
const baseDateInput = document.getElementById("baseDateInput");
const saveButton = document.getElementById("saveButton");
const balanceDisplay = document.getElementById("balanceDisplay");
const baseDateDisplay = document.getElementById("baseDateDisplay");

// 収支情報
const transactionType = document.getElementById("transactionType");
const transactionDate = document.getElementById("transactionDate");
const transactionAmount = document.getElementById("transactionAmount");
const transactionMemo = document.getElementById("transactionMemo");
const addTransactionButton = document.getElementById("addTransactionButton");
const transactionList = document.getElementById("transactionList");

// 残高計算
const targetDateInput = document.getElementById("targetDateInput");
const calculateBalanceButton = document.getElementById("calculateBalanceButton");
const calculatedBalanceDisplay = document.getElementById("calculatedBalanceDisplay");

function getBaseInfo() {
    return {
        balance: balanceInput.value,
        baseDate: baseDateInput.value
    };
}

function showBaseInfo(baseInfo) {
    balanceDisplay.textContent = baseInfo.balance;
    baseDateDisplay.textContent = baseInfo.baseDate;
}

// 収支情報
function getTransaction() {
    return {
        id: Date.now(),
        type: transactionType.value,
        date: transactionDate.value,
        amount: Number(transactionAmount.value),
        memo: transactionMemo.value
    };
}

function showTransactions(transactions) {
    transactionList.innerHTML = "";

    const sortedTransactions = sortTransactionsByDate(transactions);

    sortedTransactions.forEach((transaction) => {
        const listItem = createTransactionListItem(transaction);

        transactionList.appendChild(listItem);
    });
}

function createDeleteButton(id) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", () => {
        const transactions = deleteTransaction(id);
        showTransactions(transactions);
    });

    return deleteButton;
}

function createTransactionListItem(transaction) {
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

    const deleteButton = createDeleteButton(transaction.id);

    listItem.appendChild(transactionText);
    listItem.appendChild(deleteButton);

    return listItem;
}

function showCalculatedBalance(balance) {
    calculatedBalanceDisplay.textContent = `${balance}円`;
}

saveButton.addEventListener("click", () => {
    const baseInfo = getBaseInfo();

    if (baseInfo.balance === "" || baseInfo.baseDate === "") {
        return;
    }
    
    saveBaseInfo(baseInfo);
    showBaseInfo(baseInfo);
});

addTransactionButton.addEventListener("click", () => {
    const transaction = getTransaction();

    if (transaction.date === "" || transaction.amount === 0 || transaction.memo === "") {
        return;
    }

    const transactions = loadTransactions();

    transactions.push(transaction);

    saveTransactions(transactions);
    showTransactions(transactions);
});

calculateBalanceButton.addEventListener("click", () => {
    const baseInfo = loadBaseInfo();
    const transactions = loadTransactions();
    const targetDate = targetDateInput.value;

    if (baseInfo === null || targetDate === "") {
        return;
    }

    const balance = calculateBalance(baseInfo, transactions, targetDate);

    showCalculatedBalance(balance);
});


const savedBaseInfo = loadBaseInfo();

if (savedBaseInfo !== null) {
    showBaseInfo(savedBaseInfo);
}

const savedTransactions = loadTransactions();

showTransactions(savedTransactions);
