// ==========================================================
// utils.js: допоміжні константи та функції (листовий модуль)
// ==========================================================

// Ключі збігаються зі значеннями <option> у списках категорій
export const CATEGORY_NAMES = {
  first: "Перші страви",
  main: "Основні страви",
  dessert: "Десерти"
};

// Відкладений виклик: функція вищого порядку із замиканням.
// Змінна timerId зберігається між викликами повернутої функції
// і дозволяє скасувати попередній таймер.
export function debounce(fn, delay = 300) {
  let timerId;

  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

// Перевірка полів власного запису. Використовується і для даних форми,
// і для даних, відновлених із localStorage.
export function isValidUserFields(title, category, description) {
  if (
    typeof title !== "string" ||
    typeof category !== "string" ||
    typeof description !== "string"
  ) {
    return false;
  }

  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  return (
    trimmedTitle.length >= 3 &&
    trimmedTitle.length <= 80 &&
    trimmedDescription.length >= 10 &&
    trimmedDescription.length <= 500 &&
    Object.keys(CATEGORY_NAMES).includes(category)
  );
}