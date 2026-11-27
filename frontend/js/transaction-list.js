import { deleteTransaction, fetchTransactions } from "./api.js";
import { showTransactions } from "./view.js";

const searchConditions = {
    type: "",
    keyword: ""
};

let latestRequestId = 0;

export async function refreshTransactionList() {
    const requestId = ++latestRequestId;
    const transactions = await fetchTransactions(searchConditions);

    if (requestId !== latestRequestId) {
        return;
    }

    showTransactions(transactions, async id => {
        await deleteTransaction(id);
        await refreshTransactionList();
    });
}

export async function initTransactionList() {
    const typeButtons = document.querySelectorAll(".transaction-type-tabs button");
    const keywordInput = document.getElementById("transactionKeyword");

    typeButtons.forEach(button => {
        button.addEventListener("click", async () => {
            searchConditions.type = button.dataset.type;

            typeButtons.forEach(typeButton => {
                typeButton.setAttribute(
                "aria-pressed", 
                String(typeButton === button)
                );
            });

            await refreshTransactionList();
        });
    });

    keywordInput.addEventListener("input", async () => {
        searchConditions.keyword = keywordInput.value.trim();
        await refreshTransactionList();
    });

    await refreshTransactionList();
}