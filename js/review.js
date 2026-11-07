document.addEventListener("DOMContentLoaded", () => {
    setupReviewModalLogic();
    setupFavoriteLogic();
});

// Modal Control Functions (Exposed Globally for inline HTML onclick attributes)
window.openReviewModal = function () {
    const modal = document.getElementById('review-modal-overlay');
    if (modal) modal.classList.remove('hidden');
};

window.closeReviewModal = function () {
    const modal = document.getElementById('review-modal-overlay');
    if (modal) modal.classList.add('hidden');
};

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
        const stars = group.querySelectorAll('i');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const ratingValue = index + 1;
                scores[category] = ratingValue;

                // Update visual fill for this category's stars
                stars.forEach((s, i) => {
                    if (i < ratingValue) {
                        s.className = 'fa-solid fa-star text-yellow-500';
                    } else {
                        s.className = 'fa-regular fa-star text-black/60';
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
            const commentInput = document.getElementById('review-comment');
            const commentText = commentInput ? commentInput.value.trim() : "";
            const values = Object.values(scores);
            const isComplete = values.every(val => val > 0);

            if (!isComplete) {
                alert("Please rate all 5 categories before posting your review!");
                return;
            }

            // Calculate overall average score for the review
            const averageScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

            // Get logged in user's name or fallback to Anonymous
            const userName = document.getElementById('user-display-name')?.innerText || 'ANONYMOUS USER';

            // 1. Add to User Reviews section on the page
            appendUserReview(userName, averageScore);

            // 2. Add to Comment section if a comment was entered
            if (commentText) {
                appendUserComment(userName, commentText);
            }

            // Reset modal form
            resetReviewForm(scores);

            alert("Review posted successfully!");
            closeReviewModal();
        });
    }
}

function updateTotalStars(scores) {
    const values = Object.values(scores);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = Math.round(sum / values.length); // Average rounded to nearest star

    const totalStarsContainer = document.querySelectorAll('#total-stars i');
    totalStarsContainer.forEach((star, index) => {
        if (index < average) {
            star.className = 'fa-solid fa-star text-yellow-500';
        } else {
            star.className = 'fa-regular fa-star text-black/60';
        }
    });
}

// Append new rating item dynamically to the USER REVIEWS card
function appendUserReview(name, rating) {
    const reviewsContainer = document.querySelector('.border-2:has(> .badge-title, div:contains("USER REVIEWS")) .space-y-2') 
        || document.querySelectorAll('main div.border-2.rounded-2xl')[1]?.querySelector('div.mt-4');

    if (reviewsContainer) {
        const starStr = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const newReviewRow = document.createElement('div');
        newReviewRow.className = 'flex justify-between items-center border-b border-black/10 pb-1';
        newReviewRow.innerHTML = `
            <span>• ${name.toUpperCase()}</span>
            <span class="text-yellow-600">${starStr} ${rating}/5</span>
        `;
        reviewsContainer.prepend(newReviewRow);
    }
}

// Append new comment item dynamically to the COMMENT card
function appendUserComment(name, comment) {
    const commentContainer = document.querySelectorAll('main div.border-2.rounded-2xl')[2]?.querySelector('div.mt-4');

    if (commentContainer) {
        const newCommentBox = document.createElement('div');
        newCommentBox.className = 'space-y-1 border-b border-black/10 pb-2 mb-2';
        newCommentBox.innerHTML = `
            <p class="font-bold">• ${name.toUpperCase()}</p>
            <p class="pl-4 text-black/90 font-['Georgia'] tracking-normal lowercase text-sm sm:text-base">
                - "${comment}"
            </p>
        `;
        commentContainer.prepend(newCommentBox);
    }
}

// Reset review stars and textarea
function resetReviewForm(scores) {
    Object.keys(scores).forEach(key => scores[key] = 0);
    document.querySelectorAll('.category-rating i').forEach(star => {
        star.className = 'fa-regular fa-star text-black/60';
    });
    updateTotalStars(scores);
    const commentInput = document.getElementById('review-comment');
    if (commentInput) commentInput.value = '';
}

// Favorite Heart Toggle Logic
function setupFavoriteLogic() {
    const btnFavorite = document.getElementById('btn-favorite');
    if (!btnFavorite) return;

    btnFavorite.addEventListener('click', (e) => {
        e.preventDefault();
        btnFavorite.classList.toggle('active');
        const icon = btnFavorite.querySelector('i');
        if (icon) {
            if (btnFavorite.classList.contains('active')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        }
    });
}