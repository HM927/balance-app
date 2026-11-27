import { refreshTransactionList, initTransactionList } from "./transaction-list.js";
import { addTransaction, fetchBaseInfo, saveBaseInfo } from "./api.js";

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
    await refreshTransactionList();
});

const savedBaseInfo = await fetchBaseInfo();

if (savedBaseInfo !== null) {
    showBaseInfo(savedBaseInfo);
}

await initTransactionList()