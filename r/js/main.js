// ==========================================================
// main.js: взаємодія з DOM та подіями (сайт «Жива Традиція»)
// ==========================================================

// ----------------------------------------------------------
// 1. «Показати більше» / «Приховати» у розділі «Про ресторан»
// ----------------------------------------------------------
const detailsToggle = document.querySelector(".details-toggle");
const extraDetails = document.querySelector("#extra-details");

if (detailsToggle && extraDetails) {
  detailsToggle.addEventListener("click", () => {
    const isHidden = extraDetails.classList.toggle("is-hidden");

    detailsToggle.textContent = isHidden ? "Показати більше" : "Приховати";
    detailsToggle.setAttribute("aria-expanded", String(!isHidden));
  });
}

// ----------------------------------------------------------
// 2. «Додати в обране» на картках страв
// Один обробник на весь розділ меню (делегування подій):
// працює для кожної кнопки .favorite-button без циклів.
// ----------------------------------------------------------
const menuSection = document.querySelector("#menu");

if (menuSection) {
  menuSection.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest(".favorite-button");

    if (!favoriteButton) {
      return;
    }

    const dishCard = favoriteButton.closest(".dish-card");
    const isActive = favoriteButton.classList.toggle("is-active");

    dishCard.classList.toggle("is-active", isActive);
    favoriteButton.textContent = isActive ? "В обраному" : "Додати в обране";
    favoriteButton.setAttribute("aria-pressed", String(isActive));
  });
}

// ----------------------------------------------------------
// 3. Лічильник кількості гостей у формі бронювання
// ----------------------------------------------------------
const guestsInput = document.querySelector("#guests");
const guestsDecrease = document.querySelector("#guests-decrease");
const guestsIncrease = document.querySelector("#guests-increase");

if (guestsInput && guestsDecrease && guestsIncrease) {
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