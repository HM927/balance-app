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