export function showCalculatedBalance(balance) {
    const calculatedBalanceDisplay = document.getElementById("calculatedBalanceDisplay");
    
    calculatedBalanceDisplay.textContent = `${balance}円`;
}