import { initAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Login/Auth system
    initAuth();
});
const recipeSearchInput = document.getElementById("recipe-search");

if (recipeSearchInput) {
    recipeSearchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const categorySections = document.querySelectorAll(".category-section");

        categorySections.forEach((section) => {
            const dishCards = section.querySelectorAll(".dish-card");
            let hasVisibleCard = false;

            dishCards.forEach((card) => {
                const textContent = card.textContent.toLowerCase();
                const imgAlt = card.querySelector("img")?.alt.toLowerCase() || "";

                if (textContent.includes(query) || imgAlt.includes(query)) {
                    card.style.display = "";
                    hasVisibleCard = true;
                } else {
                    card.style.display = "none";
                }
            });

            // Hide the entire category section if no cards match, 
            // otherwise keep it visible so content doesn't collapse upwards.
            if (hasVisibleCard || section.textContent.toLowerCase().includes(query)) {
                section.style.display = "";
                // If the category title matched, show all its dishes
                if (section.textContent.toLowerCase().includes(query) && !hasVisibleCard) {
                    dishCards.forEach(card => card.style.display = "");
                }
            } else {
                section.style.display = "none";
            }
        });
    });
}
