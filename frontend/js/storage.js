export function saveBaseInfo(baseInfo) {
    localStorage.setItem("baseInfo", JSON.stringify(baseInfo));
}

export function loadBaseInfo() {
    const baseInfo = localStorage.getItem("baseInfo");

    if (baseInfo === null) {
        return null;
    }

    return JSON.parse(baseInfo);
}

export function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

export function loadTransactions() {
    const transactions = localStorage.getItem("transactions");

    if (transactions === null) {
        return [];
    }
    
    return JSON.parse(transactions);
}