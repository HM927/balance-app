const balanceInput = document.getElementById("balanceInput");
const baseDateInput = document.getElementById("baseDateInput");
const saveButton = document.getElementById("saveButton");
const balanceDisplay = document.getElementById("balanceDisplay");
const baseDateDisplay = document.getElementById("baseDateDisplay");

function getBaseInfo() {
    return {
        balance: balanceInput.value,
        baseDate: baseDateInput.value
    };
}

function saveBaseInfo(baseInfo) {
    localStorage.setItem("balance", baseInfo.balance);
    localStorage.setItem("baseDate", baseInfo.baseDate);
}

function showBaseInfo(baseInfo) {
    balanceDisplay.textContent = baseInfo.balance;
    baseDateDisplay.textContent = baseInfo.baseDate;
}

function loadBaseInfo() {
    const balance = localStorage.getItem("balance");
    const baseDate = localStorage.getItem("baseDate");

    if (balance === null || baseDate === null) {
        return null;
    }

    return {
            balance: balance,
            baseDate: baseDate
    };
}

saveButton.addEventListener("click", () => {
    const baseInfo = getBaseInfo();

    if (baseInfo.balance === "" || baseInfo.baseDate === "") {
        return;
    }
    
    saveBaseInfo(baseInfo);
    showBaseInfo(baseInfo);
})

const savedBaseInfo = loadBaseInfo();

if (savedBaseInfo !== null) {
    showBaseInfo(savedBaseInfo);
}