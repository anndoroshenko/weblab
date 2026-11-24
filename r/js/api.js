// ==========================================================
// api.js: завантаження та перевірка даних із items.json
// ==========================================================
import { CATEGORY_NAMES } from "./utils.js";

const ALLOWED_CATEGORIES = Object.keys(CATEGORY_NAMES);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Дозволено лише локальні шляхи на зразок "images/menu/borshch.jpg".
// Відхиляються адреси зі схемою (http:, data:, javascript:),
// шляхи, що починаються з "/" або "//", та шляхи з "..".
function isLocalImagePath(path) {
  return (
    isNonEmptyString(path) &&
    !/^([a-z][a-z0-9+.-]*:|\/)/i.test(path) &&
    !path.includes("..")
  );
}

function validateItems(data) {
  const seenIds = new Set();

  data.forEach((item, index) => {
    const label = `Запис №${index + 1}`;

    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      throw new Error(`${label}: очікується об’єкт`);
    }

    if (!Number.isInteger(item.id) || item.id <= 0) {
      throw new Error(`${label}: id має бути додатним цілим числом`);
    }

    if (seenIds.has(item.id)) {
      throw new Error(`${label}: id ${item.id} повторюється`);
    }
    seenIds.add(item.id);

    if (!isNonEmptyString(item.title)) {
      throw new Error(`${label}: title має бути непорожнім рядком`);
    }

    if (!ALLOWED_CATEGORIES.includes(item.category)) {
      throw new Error(`${label}: недопустима категорія "${item.category}"`);
    }

    if (!isNonEmptyString(item.description)) {
      throw new Error(`${label}: description має бути непорожнім рядком`);
    }

    if (!isLocalImagePath(item.image)) {
      throw new Error(`${label}: image має бути локальним шляхом`);
    }

    if (
      typeof item.price !== "number" ||
      !Number.isFinite(item.price) ||
      item.price < 0
    ) {
      throw new Error(`${label}: price має бути невід’ємним числом`);
    }
  });
}

export async function loadItems() {
  // Шлях відлічується від api.js, а не від сторінки
  const url = new URL("../data/items.json", import.meta.url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Очікується масив об’єктів");
  }

  validateItems(data);

  return data;
}