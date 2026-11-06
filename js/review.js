document.addEventListener("DOMContentLoaded", () => {
    setupReviewModalLogic();
});

function openReviewModal() {
    const modal = document.getElementById('review-modal-overlay');
    if (modal) modal.classList.remove('hidden');
}

function closeReviewModal() {
    const modal = document.getElementById('review-modal-overlay');
    if (modal) modal.classList.add('hidden');
}

function setupReviewModalLogic() {
    const scores = {
        taste: 0,
        appearance: 0,
        ease: 0,
        ingredients: 0,
        repeat: 0
    };

    // Handle individual category star clicks
    document.querySelectorAll('.category-rating').forEach(group => {
        const category = group.dataset.category;
        const stars = group.querySelectorAll('.fa-star');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const ratingValue = index + 1;
                scores[category] = ratingValue;

                // Update visual fill for this category's stars
                stars.forEach((s, i) => {
                    if (i < ratingValue) {
                        s.classList.remove('fa-regular', 'text-black/60');
                        s.classList.add('fa-solid', 'text-yellow-500');
                    } else {
                        s.classList.remove('fa-solid', 'text-yellow-500');
                        s.classList.add('fa-regular', 'text-black/60');
                    }
                });

                // Update the overall TOTAL average stars dynamically
                updateTotalStars(scores);
            });
        });
    });

    // Handle Post Review Button Click
    const postBtn = document.getElementById('post-review-btn');
    if (postBtn) {
        postBtn.addEventListener('click', () => {
            const comment = document.getElementById('review-comment').value;
            const isComplete = Object.values(scores).every(val => val > 0);

            if (!isComplete) {
                alert("Please rate all categories before posting your review!");
                return;
            }

            console.log("Submitted Review Data:", { scores, comment });
            alert("Review posted successfully!");
            closeReviewModal();
        });
    }
}

function updateTotalStars(scores) {
    const values = Object.values(scores);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = Math.round(sum / values.length); // Calculate average rounded to nearest whole star

    const totalStarsContainer = document.querySelectorAll('#total-stars .fa-star');
    totalStarsContainer.forEach((star, index) => {
        if (index < average) {
            star.classList.remove('fa-regular', 'text-black/60');
            star.classList.add('fa-solid', 'text-yellow-500');
        } else {
            star.classList.remove('fa-solid', 'text-yellow-500');
            star.classList.add('fa-regular', 'text-black/60');
        }
    });
}
const btnFavorite = document.getElementById('btn-favorite');

btnFavorite.addEventListener('click', () => {
    btnFavorite.classList.toggle('active');
    const icon = btnFavorite.querySelector('i');
    if (btnFavorite.classList.contains('active')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        showToast('Added to Favorites!', 'fa-heart');
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        showToast('Removed from Favorites.', 'fa-heart');
    }
});