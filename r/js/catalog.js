// ==========================================================
// catalog.js: чиста фільтрація та безпечний рендеринг карток
// ==========================================================
import { CATEGORY_NAMES } from "./utils.js";

// ----------------------------------------------------------
// Чиста функція: не читає DOM і не змінює вхідні дані
// ----------------------------------------------------------
export function filterItems(items, query, category) {
  const text = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesText = `${item.title} ${item.description}`
      .toLowerCase()
      .includes(text);
    const matchesCategory = category === "all" || item.category === category;

    return matchesText && matchesCategory;
  });
}

// Стан кнопки «Додати в обране» та картки (використовується і в main.js)
export function setFavoriteState(card, button, isActive) {
  card.classList.toggle("is-active", isActive);
  button.classList.toggle("is-active", isActive);
  button.textContent = isActive ? "В обраному" : "Додати в обране";
  button.setAttribute("aria-pressed", String(isActive));
}

// ----------------------------------------------------------
// Створення вузлів DOM (textContent замість innerHTML)
// ----------------------------------------------------------
function createCard(item, isFavorite) {
  const card = document.createElement("li");
  card.className = "card dish-card";
  card.dataset.id = String(item.id);

  const image = document.createElement("img");
  image.className = "dish-image";
  image.src = item.image;
  image.alt = item.title;

  const name = document.createElement("h4");
  name.className = "dish-name";
  name.textContent = item.title;

  const description = document.createElement("p");
  description.className = "dish-description";
  description.textContent = item.description;

  const price = document.createElement("p");
  price.className = "dish-price";
  price.textContent = `${item.price} грн`;

  const favoriteButton = document.createElement("button");
  favoriteButton.className = "favorite-button";
  favoriteButton.type = "button";

  card.append(image, name, description, price, favoriteButton);
  setFavoriteState(card, favoriteButton, isFavorite);

  return card;
}

function createCategorySection(categoryKey, categoryItems, favoriteIds) {
  const section = document.createElement("article");
  section.className = "menu-category";

  const title = document.createElement("h3");
  title.className = "menu-category-title";
  title.textContent = CATEGORY_NAMES[categoryKey];

  const list = document.createElement("ul");
  list.className = "dish-list";
  list.append(
    ...categoryItems.map((item) =>
      createCard(item, favoriteIds.includes(item.id))
    )
  );

  const moreButton = document.createElement("button");
  moreButton.className = "more-button";
  moreButton.type = "button";
  moreButton.title = "Показати більше";
  moreButton.setAttribute("aria-label", "Показати більше");
  moreButton.textContent = "• • •";

  section.append(title, list, moreButton);

  return section;
}

// ----------------------------------------------------------
// Рендеринг: оновлює контейнер, лічильник і порожній стан
// ----------------------------------------------------------
export function renderItems(items, grid, count, empty, favoriteIds = []) {
  const fragment = document.createDocumentFragment();

  Object.keys(CATEGORY_NAMES).forEach((categoryKey) => {
    const categoryItems = items.filter((item) => item.category === categoryKey);

    if (categoryItems.length > 0) {
      fragment.append(
        createCategorySection(categoryKey, categoryItems, favoriteIds)
      );
    }
  });

  grid.replaceChildren(fragment);
  count.textContent = `Знайдено страв: ${items.length}`;
  empty.hidden = items.length !== 0;
}