import {sortTransactionsByDate} from "./transactions.js";
import { createTransactionListItem } from "./view.js";
import { fetchTransactions, addTransaction, deleteTransaction, fetchBaseInfo, saveBaseInfo } from "./api.js";

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

function getBaseInfo() {
    return {
        balance: Number(balanceInput.value),
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
        const listItem = createDeletableTransactionListItem(transaction);

        transactionList.appendChild(listItem);
    });
}

function createDeleteButton(id) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.classList.add("delete-button");

    deleteButton.addEventListener("click", async () => {
        await deleteTransaction(id);

        const transactions = await fetchTransactions();
        showTransactions(transactions);
    });

    return deleteButton;
}

function createDeletableTransactionListItem(transaction) {
    const listItem = createTransactionListItem(transaction);
    
    const deleteButton = createDeleteButton(transaction.id);

    listItem.appendChild(deleteButton);

    return listItem;
}

saveButton.addEventListener("click", async () => {
    if (balanceInput.value === "" || baseDateInput.value === "") {
        return;
    }
    
    const baseInfo = getBaseInfo();
    await saveBaseInfo(baseInfo);

    const savedBaseInfo = await fetchBaseInfo();

    if(savedBaseInfo !== null) {
        showBaseInfo(savedBaseInfo);
    }
});

addTransactionButton.addEventListener("click", async () => {
    const transaction = getTransaction();

    if (transaction.date === "" || transaction.amount === 0 || transaction.memo === "") {
        return;
    }

    await addTransaction(transaction);

    const transactions = await fetchTransactions();
    showTransactions(transactions);
});

const savedBaseInfo = await fetchBaseInfo();

if (savedBaseInfo !== null) {
    showBaseInfo(savedBaseInfo);
}

const savedTransactions = await fetchTransactions();

showTransactions(savedTransactions);
