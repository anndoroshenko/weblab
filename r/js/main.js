// ==========================================================
// main.js: вхідний модуль. Імпортує api, catalog, utils, userItems
// ==========================================================
import { loadItems } from "./api.js";
import { filterItems, renderItems, setFavoriteState } from "./catalog.js";
import { debounce } from "./utils.js";
import { initUserItems } from "./userItems.js";

// ----------------------------------------------------------
// 1. Елементи DOM каталогу
// ----------------------------------------------------------
const searchInput = document.querySelector("#dish-search");
const categorySelect = document.querySelector("#category-filter");
const grid = document.querySelector("#menu-catalog");
const resultsCount = document.querySelector("#results-count");
const emptyMessage = document.querySelector("#empty-message");
const statusMessage = document.querySelector("#load-status");
const errorMessage = document.querySelector("#load-error");
const retryButton = document.querySelector("#retry-load");

// ----------------------------------------------------------
// 2. Стан каталогу
// ----------------------------------------------------------
let items = [];
let favoriteIds = [];

// ----------------------------------------------------------
// 3. Оновлення відображення: чиста фільтрація + рендеринг
// ----------------------------------------------------------
function updateView() {
  const filteredItems = filterItems(
    items,
    searchInput.value,
    categorySelect.value
  );

  renderItems(filteredItems, grid, resultsCount, emptyMessage, favoriteIds);
}

// ----------------------------------------------------------
// 4. Завантаження даних: стани «Завантаження» та «Помилка»
// ----------------------------------------------------------
async function init() {
  searchInput.disabled = true;
  categorySelect.disabled = true;
  retryButton.disabled = true;
  retryButton.hidden = true;
  errorMessage.hidden = true;
  statusMessage.textContent = "Завантаження…";
  grid.setAttribute("aria-busy", "true");
  grid.replaceChildren();
  resultsCount.textContent = "";
  emptyMessage.hidden = true;

  let loaded = false;

  try {
    items = await loadItems();
    updateView();
    loaded = true;
  } catch (error) {
    items = [];
    errorMessage.textContent =
      "Не вдалося завантажити каталог. Спробуйте ще раз.";
    errorMessage.hidden = false;
    retryButton.hidden = false;
    console.error(error);
  } finally {
    statusMessage.textContent = "";
    grid.setAttribute("aria-busy", "false");
    searchInput.disabled = !loaded;
    categorySelect.disabled = !loaded;
    retryButton.disabled = false;
  }
}

// ----------------------------------------------------------
// 5. «Додати в обране»: один обробник на контейнер каталогу
// ----------------------------------------------------------
function handleFavoriteClick(event) {
  const favoriteButton = event.target.closest(".favorite-button");

  if (!favoriteButton) {
    return;
  }

  const card = favoriteButton.closest(".dish-card");
  const dishId = Number(card.dataset.id);
  const isActive = !favoriteIds.includes(dishId);

  favoriteIds = isActive
    ? [...favoriteIds, dishId]
    : favoriteIds.filter((id) => id !== dishId);

  setFavoriteState(card, favoriteButton, isActive);
}

// ----------------------------------------------------------
// 6. Реєстрація обробників каталогу (один раз, поза init)
// ----------------------------------------------------------
searchInput.addEventListener("input", debounce(updateView, 300));
categorySelect.addEventListener("change", updateView);
retryButton.addEventListener("click", init);
grid.addEventListener("click", handleFavoriteClick);

// ----------------------------------------------------------
// 7. Взаємодії з лабораторної №5: «Показати більше» та лічильник гостей
// ----------------------------------------------------------
function setupDetailsToggle() {
  const detailsToggle = document.querySelector(".details-toggle");
  const extraDetails = document.querySelector("#extra-details");

  if (!detailsToggle || !extraDetails) {
    return;
  }

  detailsToggle.addEventListener("click", () => {
    const isHidden = extraDetails.classList.toggle("is-hidden");

    detailsToggle.textContent = isHidden ? "Показати більше" : "Приховати";
    detailsToggle.setAttribute("aria-expanded", String(!isHidden));
  });
}

function setupGuestsCounter() {
  const guestsInput = document.querySelector("#guests");
  const guestsDecrease = document.querySelector("#guests-decrease");
  const guestsIncrease = document.querySelector("#guests-increase");

  if (!guestsInput || !guestsDecrease || !guestsIncrease) {
    return;
  }

  const minGuests = Number(guestsInput.min);
  const maxGuests = Number(guestsInput.max);

  const setGuests = (value) => {
    guestsInput.value = Math.min(maxGuests, Math.max(minGuests, value));
  };

  guestsDecrease.addEventListener("click", () => {
    setGuests(Number(guestsInput.value) - 1);
  });

  guestsIncrease.addEventListener("click", () => {
    setGuests(Number(guestsInput.value) + 1);
  });

  guestsInput.addEventListener("change", () => {
    setGuests(Number(guestsInput.value));
  });
}

setupDetailsToggle();
setupGuestsCounter();

// ----------------------------------------------------------
// 8. Власні записи: ініціалізація незалежно від мережі
// ----------------------------------------------------------
initUserItems();

// ----------------------------------------------------------
// 9. Запуск завантаження каталогу
// ----------------------------------------------------------
init();
