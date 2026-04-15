const memoInput = document.querySelector("#memo-input");
const addButton = document.querySelector("#add-button");
const memoList = document.querySelector("#memo-list");

addButton.addEventListener("click", function () {
    const memoText = memoInput.value;

    if (memoText === "") {
        return;
    }

    const newMemoItem = document.createElement("li");
    newMemoItem.textContent = memoText;

    memoList.appendChild(newMemoItem);

    memoInput.value = ""
});