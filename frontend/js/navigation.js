const buttons = document.querySelectorAll(".bottom-nav button");
const pages = document.querySelectorAll("main > section")

function showPage(pageId) {
    pages.forEach(page => {
        page.hidden = page.id !== pageId;
    });
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    })
})