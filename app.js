const homeScreen = document.getElementById("home-screen");
const threadScreen = document.getElementById("thread-screen");

const openModalButton = document.getElementById("open-modal-button");
const closeModalButton = document.getElementById("close-modal-button");
const createThreadButton = document.getElementById("create-thread-button");

const threadModal = document.getElementById("thread-modal");
const threadTitleInput = document.getElementById("thread-title-input");

const threadList = document.getElementById("thread-list");
const threadTitle = document.getElementById("thread-title");
const memoContent = document.getElementById("memo-content");

const backButton = document.getElementById("back-button");
const saveButton = document.getElementById("save-button");
const deleteButton = document.getElementById("delete-button");

const showAllButton = document.getElementById("show-all-button");
const showFavoritesButton = document.getElementById("show-favorites-button");
const favoriteButton = document.getElementById("favorite-button");

const showQrButton = document.getElementById("show-qr-button");
const downloadImageButton = document.getElementById("download-image-button");
const qrModal = document.getElementById("qr-modal");
const qrCodeContainer = document.getElementById("qr-code-container");
const closeQrModalButton = document.getElementById("close-qr-modal-button");

console.log({
  homeScreen,
  threadScreen,
  openModalButton,
  closeModalButton,
  createThreadButton,
  threadModal,
  threadTitleInput,
  threadList,
  threadTitle,
  memoContent,
  backButton,
  saveButton,
  deleteButton
});

let threads = JSON.parse(localStorage.getItem("threads")) || [];
let currentThreadId = null;
let currentFilter = "all";
let originalTitle = "";
let originalContent = "";

function renderThreadList() {
  threadList.innerHTML = "";

  const displayThreads = currentFilter === "favorite"
    ? threads.filter((thread) => thread.isFavorite)
    : threads;

  if (displayThreads.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = currentFilter === "favorite"
      ? "お気に入りのメモはありません"
      : "まだメモはありません";
    threadList.appendChild(emptyMessage);
    return;
  }

  displayThreads.forEach((thread) => {
    const li = document.createElement("li");
    li.classList.add("thread-item");

    const previewText = thread.content
      ? thread.content.substring(0, 40)
      : "メモ内容はまだありません";

    const favoriteMark = thread.isFavorite ? "★ " : "";

    li.innerHTML = `
      <div class="thread-item-title">${favoriteMark}${escapeHtml(thread.title)}</div>
      <div class="thread-item-preview">${escapeHtml(previewText)}</div>
    `;

    li.addEventListener("click", () => {
      openThread(thread.id);
    });

    threadList.appendChild(li);
  });
}

function openModal() {
  threadModal.classList.remove("hidden");
  threadModal.classList.add("show");
  threadTitleInput.value = "";
}

function closeModal() {
  threadModal.classList.remove("show");
  threadModal.classList.add("hidden");
}

function createThread() {
  const title = threadTitleInput.value.trim();

  if (!title) {
    alert("タイトルを入力してください");
    return;
  }

  const newThread = {
    id: Date.now(),
    title: title,
    content: "",
    isFavorite: false
  };

  threads.unshift(newThread);
  saveThreads();
  renderThreadList();
  closeModal();
}

function openThread(threadId) {
  const thread = threads.find((item) => item.id === threadId);

  if (!thread) return;

  currentThreadId = threadId;
  threadTitle.value = thread.title;
  memoContent.value = thread.content;

  originalTitle = thread.title;
  originalContent = thread.content;

  updateFavoriteButton(thread);

  homeScreen.classList.add("hidden");
  threadScreen.classList.remove("hidden");
}

function goBackHome() {
  const isChanged =
    threadTitle.value.trim() !== originalTitle ||
    memoContent.value !== originalContent;

  if (isChanged) {
    const isConfirmed = confirm("保存していない変更があります。保存せずに戻りますか？");

    if (!isConfirmed) return;
  }

  currentThreadId = null;
  threadScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  renderThreadList();
}

function saveCurrentThread() {
  const thread = threads.find((item) => item.id === currentThreadId);

    if (!thread) return;
    
    const editedTitle = threadTitle.value.trim();

    if (!editedTitle) {
        alert("タイトルを入力してください");
        return;
    }

    thread.title = editedTitle;
    thread.content = memoContent.value;
    
    originalTitle = editedTitle;
    originalContent = memoContent.value;
    
    saveThreads();
    renderThreadList();
    alert("保存しました");
}

function deleteCurrentThread() {
  if (currentThreadId === null) return;

  const isConfirmed = confirm("このメモを削除しますか？");

  if (!isConfirmed) return;

  threads = threads.filter((item) => item.id !== currentThreadId);
  saveThreads();
  goBackHome();
}

function saveThreads() {
  localStorage.setItem("threads", JSON.stringify(threads));
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function updateFavoriteButton(thread) {
  if (thread.isFavorite) {
    favoriteButton.textContent = "★ お気に入り解除";
    favoriteButton.classList.add("favorite-active");
  } else {
    favoriteButton.textContent = "☆ お気に入り";
    favoriteButton.classList.remove("favorite-active");
  }
}

function toggleFavorite() {
  const thread = threads.find((item) => item.id === currentThreadId);

  if (!thread) return;

  thread.isFavorite = !thread.isFavorite;

  saveThreads();
  updateFavoriteButton(thread);
  renderThreadList();
}

function showAllThreads() {
  currentFilter = "all";
  showAllButton.classList.add("active-tab");
  showFavoritesButton.classList.remove("active-tab");
  renderThreadList();
}

function showFavoriteThreads() {
  currentFilter = "favorite";
  showFavoritesButton.classList.add("active-tab");
  showAllButton.classList.remove("active-tab");
  renderThreadList();
}

function showQrModal() {
  const title = threadTitle.value.trim();
  const content = memoContent.value;
  
  if (!title && !content) {
    alert("共有する内容がありません");
    return;
  }
  
  const textToShare = `${title}\n\n${content}`;
  const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(textToShare)}`;
  
  qrCodeContainer.innerHTML = "";
  new QRCode(qrCodeContainer, {
    text: lineShareUrl,
    width: 320,  // サイズを大きくして読み取りやすく
    height: 320,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.L // エラー訂正レベルを下げて密度を下げる
  });
  
  qrModal.classList.remove("hidden");
  qrModal.classList.add("show");
}

function closeQrModal() {
  qrModal.classList.remove("show");
  qrModal.classList.add("hidden");
  qrCodeContainer.innerHTML = "";
}

function downloadImage() {
  // 一時的にアクションボタンを隠す
  const actions = document.querySelectorAll(".thread-actions");
  actions.forEach(el => el.style.display = "none");
  
  // html2canvasにおけるtextareaの折り返し・スクロール見切れバグを回避するため、
  // 一時的にdiv要素に置き換えてから画像化する
  const tempDiv = document.createElement("div");
  const computedStyle = window.getComputedStyle(memoContent);
  
  // textareaの見た目をdivにコピー
  tempDiv.style.width = computedStyle.width;
  tempDiv.style.minHeight = computedStyle.height;
  tempDiv.style.padding = computedStyle.padding;
  tempDiv.style.fontSize = computedStyle.fontSize;
  tempDiv.style.lineHeight = computedStyle.lineHeight;
  tempDiv.style.border = computedStyle.border;
  tempDiv.style.borderRadius = computedStyle.borderRadius;
  tempDiv.style.boxSizing = computedStyle.boxSizing;
  tempDiv.style.fontFamily = computedStyle.fontFamily;
  tempDiv.style.backgroundColor = computedStyle.backgroundColor;
  tempDiv.style.color = computedStyle.color;
  tempDiv.style.whiteSpace = "pre-wrap"; // 改行と折り返しを維持
  tempDiv.style.wordBreak = "break-word";
  tempDiv.style.margin = computedStyle.margin;
  
  // テキストをセット
  tempDiv.textContent = memoContent.value;
  
  // DOMを一時的に入れ替え
  memoContent.style.display = "none";
  memoContent.parentNode.insertBefore(tempDiv, memoContent);
  
  html2canvas(threadScreen, {
    backgroundColor: "#ffffff",
    scale: 2
  }).then(canvas => {
    // スタイル・要素を元に戻す
    tempDiv.remove();
    memoContent.style.display = "";
    actions.forEach(el => el.style.display = "");
    
    const link = document.createElement("a");
    const safeTitle = (threadTitle.value.trim() || "memo").substring(0, 10);
    link.download = `${safeTitle}_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }).catch(err => {
    console.error(err);
    // エラー時も元に戻す
    tempDiv.remove();
    memoContent.style.display = "";
    actions.forEach(el => el.style.display = "");
    alert("画像の生成に失敗しました");
  });
}

openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
createThreadButton.addEventListener("click", createThread);

backButton.addEventListener("click", goBackHome);
saveButton.addEventListener("click", saveCurrentThread);
deleteButton.addEventListener("click", deleteCurrentThread);
favoriteButton.addEventListener("click", toggleFavorite);
showAllButton.addEventListener("click", showAllThreads);
showFavoritesButton.addEventListener("click", showFavoriteThreads);

showQrButton.addEventListener("click", showQrModal);
closeQrModalButton.addEventListener("click", closeQrModal);
downloadImageButton.addEventListener("click", downloadImage);

renderThreadList();