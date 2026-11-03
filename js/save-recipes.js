// JS/save-recipes.js
import { initAuth } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Authentication & Login Module
    initAuth();

    // --- DOM Elements ---
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const uploadPlaceholder = document.getElementById("upload-placeholder");
    const imagePreview = document.getElementById("image-preview");
    const foodTagOverlay = document.getElementById("food-tag-overlay");
    const changePhotoOverlay = document.getElementById("change-photo-overlay");

    const btnFoodName = document.getElementById("btn-food-name");
    const foodNameLabel = document.getElementById("food-name-label");

    const btnSave = document.getElementById("btn-save");
    const btnPost = document.getElementById("btn-post");

    const modalFoodName = document.getElementById('modal-food-name');
    const foodNameInput = document.getElementById('food-name-input');
    const modalCancel = document.getElementById('modal-cancel');
    const modalSave = document.getElementById('modal-save');

    const culturalText = document.getElementById("cultural-text");
    const ingredientsText = document.getElementById("ingredients-text");
    const stepsText = document.getElementById("steps-text");

    let currentImageData = "";
    let currentFoodName = "";

    // --- Toast Notification System ---
    const showToast = (message, isError = false) => {
        let container = document.getElementById("toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = "toast";
        if (isError) {
            toast.style.backgroundColor = "#ff6b6b";
            toast.style.color = "#ffffff";
        }
        toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> <span>${message}</span>`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("toast-out");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // --- Image Upload & Drag/Drop Handler ---
    if (dropZone) dropZone.addEventListener("click", () => fileInput.click());

    if (dropZone) {
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("drag-over");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("drag-over");
        });

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("drag-over");
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleImageFile(e.dataTransfer.files[0]);
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            if (e.target.files && e.target.files[0]) {
                handleImageFile(e.target.files[0]);
            }
        });
    }

    const handleImageFile = (file) => {
        if (!file.type.startsWith("image/")) {
            showToast("Please upload a valid image file.", true);
            return;
        }

        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
            currentImageData = uploadEvent.target.result;
            imagePreview.src = currentImageData;
            imagePreview.classList.remove("hidden");
            uploadPlaceholder.classList.add("hidden");
            foodTagOverlay.classList.remove("hidden");
            changePhotoOverlay.classList.remove("hidden");
            showToast("Photo uploaded successfully!");
        };
        reader.readAsDataURL(file);
    };

    // --- Food Name Custom Modal Handlers ---
    if (btnFoodName) {
        btnFoodName.addEventListener('click', () => {
            foodNameInput.value = foodNameLabel.textContent === 'ADD FOOD NAME' ? '' : foodNameLabel.textContent;
            modalFoodName.classList.remove('hidden');
            foodNameInput.focus();
        });
    }

    if (modalCancel) {
        modalCancel.addEventListener('click', () => {
            modalFoodName.classList.add('hidden');
        });
    }

    if (modalSave) modalSave.addEventListener('click', saveFoodName);

    if (foodNameInput) {
        foodNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveFoodName();
            if (e.key === 'Escape') modalFoodName.classList.add('hidden');
        });
    }

    function saveFoodName() {
        const val = foodNameInput.value.trim();
        if (val) {
            currentFoodName = val;
            foodNameLabel.textContent = val.toUpperCase();
            foodTagOverlay.textContent = val.toUpperCase();
            foodTagOverlay.classList.remove('hidden');
            showToast(`Food name set to: ${val}`);
        } else {
            currentFoodName = "";
            foodNameLabel.textContent = 'ADD FOOD NAME';
            foodTagOverlay.classList.add('hidden');
        }
        modalFoodName.classList.add('hidden');
    }

    // --- Gather Recipe Data Payload ---
    const getRecipePayload = () => ({
        id: Date.now(),
        foodName: currentFoodName || "Untitled Dish",
        image: currentImageData || "https://placehold.co/600x400/8B4513/FFF?text=Recipe",
        cultural: culturalText ? culturalText.value.trim().toUpperCase() : "",
        ingredients: ingredientsText ? ingredientsText.value.trim().toUpperCase() : "",
        steps: stepsText ? stepsText.value.trim().toUpperCase() : ""
    });

    // --- SAVE RECIPES BUTTON ACTION (EXPORT AS HTML FILE) ---
if (btnSave) {
    btnSave.addEventListener("click", async () => {
        const recipePayload = {
            foodName: currentFoodName || "Untitled Dish",
            image: currentImageData || "",
            cultural: culturalText ? culturalText.value.trim() : "",
            ingredients: ingredientsText ? ingredientsText.value.trim() : "",
            steps: stepsText ? stepsText.value.trim() : ""
        };

        if (!recipePayload.ingredients && !recipePayload.steps) {
            showToast("Please add at least ingredients or steps before saving.", true);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/save-recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(recipePayload)
            });

            const result = await response.json();

            if (result.success) {
                showToast(`Saved to server folder: ${result.fileName}`);
            } else {
                showToast(result.message || "Failed to save recipe.", true);
            }
        } catch (error) {
            console.error("Backend Error:", error);
            showToast("Unable to connect to backend server.", true);
        }
    });
}

    // --- POST BUTTON ACTION ---
    if (btnPost) {
        btnPost.addEventListener("click", () => {
            const recipe = getRecipePayload();

            if (!recipe.foodName || recipe.foodName === "Untitled Dish") {
                showToast("Please add a food name before posting.", true);
                return;
            }
            if (!recipe.ingredients || !recipe.steps) {
                showToast("Ingredients and step-by-step instructions are required to post.", true);
                return;
            }

            let communityPosts = JSON.parse(localStorage.getItem("kasiyaCommunityPosts")) || [];
            communityPosts.unshift(recipe);
            localStorage.setItem("kasiyaCommunityPosts", JSON.stringify(communityPosts));

            showToast("Recipe posted successfully to the community!");

            setTimeout(() => {
                currentFoodName = "";
                currentImageData = "";
                foodNameLabel.textContent = "ADD FOOD NAME";
                imagePreview.src = "";
                imagePreview.classList.add("hidden");
                uploadPlaceholder.classList.remove("hidden");
                foodTagOverlay.classList.add("hidden");
                changePhotoOverlay.classList.add("hidden");
                if (culturalText) culturalText.value = "";
                if (ingredientsText) ingredientsText.value = "";
                if (stepsText) stepsText.value = "";
            }, 1000);
        });
    }
});