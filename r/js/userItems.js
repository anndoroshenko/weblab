// ==========================================================
// userItems.js: власні записи користувача (Create, Read, Delete)
// ==========================================================
import { readUserItems, writeUserItems } from "./storage.js";
import { CATEGORY_NAMES, isValidUserFields } from "./utils.js";

export function initUserItems() {
  const form = document.querySelector("#user-item-form");
  const list = document.querySelector("#user-list");
  const message = document.querySelector("#user-message");
  const empty = document.querySelector("#user-empty");

  if (!form || !list || !message || !empty) {
    return;
  }

  const titleField = form.elements.namedItem("title");

  // ------------------------------------------------------
  // Відновлення даних перед першим рендерингом.
  // Після читання нічого не записуємо: порожній масив
  // не повинен затерти пошкоджені дані.
  // ------------------------------------------------------
  let userItems;

  try {
    userItems = readUserItems();
  } catch (error) {
    userItems = [];
    message.textContent =
      "Не вдалося відновити записи. Список почато в пам’яті.";
    console.error(error);
  }

  // ------------------------------------------------------
  // Read: безпечне відображення (createElement + textContent)
  // ------------------------------------------------------
  function createUserCard(item) {
    const card = document.createElement("article");
    card.className = "card user-card";
    card.dataset.id = item.id;

    const category = document.createElement("p");
    category.className = "user-card-category";
    category.textContent = CATEGORY_NAMES[item.category];

    const title = document.createElement("h4");
    title.className = "user-card-title";
    title.textContent = item.title;

    const description = document.createElement("p");
    description.className = "user-card-description";
    description.textContent = item.description;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Видалити";
    deleteButton.dataset.deleteId = item.id;
    deleteButton.setAttribute("aria-label", `Видалити запис «${item.title}»`);

    card.append(category, title, description, deleteButton);

    return card;
  }

  function renderUserItems() {
    list.replaceChildren(...userItems.map(createUserCard));
    empty.hidden = userItems.length !== 0;
  }

  // ------------------------------------------------------
  // Спільна зміна списку: пам'ять, інтерфейс, потім запис.
  // Якщо сховище недоступне, зміна лишається лише в пам'яті.
  // ------------------------------------------------------
  function commit(nextItems) {
    userItems = nextItems;
    renderUserItems();

    try {
      writeUserItems(userItems);
      return true;
    } catch (error) {
      message.textContent =
        "Зміни є в пам’яті, але не збережені після закриття сторінки.";
      console.error(error);
      return false;
    }
  }

  // ------------------------------------------------------
  // Create: обробник submit реєструється один раз
  // ------------------------------------------------------
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const category = String(data.get("category") ?? "");
    const description = String(data.get("description") ?? "").trim();

    if (!isValidUserFields(title, category, description)) {
      message.textContent = "Перевірте назву, категорію й опис.";
      titleField.focus();
      return;
    }

    const record = {
      id: `user-${crypto.randomUUID()}`,
      title,
      category,
      description
    };

    const saved = commit([...userItems, record]);

    if (saved) {
      message.textContent = "Запис додано й збережено.";
    }

    form.reset();
    titleField.focus();
  });

  // ------------------------------------------------------
  // Delete: обробник на контейнері працює і після перерендерингу
  // ------------------------------------------------------
  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-id]");

    if (!button || !list.contains(button)) {
      return;
    }

    const id = button.dataset.deleteId;
    const saved = commit(userItems.filter((item) => item.id !== id));

    if (saved) {
      message.textContent = "Запис видалено й зміни збережено.";
    }

    titleField.focus();
  });

  renderUserItems();
}