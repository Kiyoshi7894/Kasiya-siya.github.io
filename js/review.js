document.addEventListener("DOMContentLoaded", () => {
    setupReviewModalLogic();
    setupFavoriteLogic();
<<<<<<< HEAD
=======
    updateOverallRecipeRating(); // Dynamically calculate and render rating on load
>>>>>>> bc464d6a030cf1a153511e72cfc39855eeb8b502
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

    // Handle individual category star clicks inside the modal
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

                // Update modal's internal TOTAL average stars dynamically
                updateModalTotalStars(scores);
            });
        });
    });

    // Handle Post Review Button Click
    const postBtn = document.getElementById('post-review-btn');
    if (postBtn) {
        postBtn.addEventListener('click', () => {
<<<<<<< HEAD
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
=======
            // Check if user is logged in
            const userDisplay = document.getElementById('user-display-name');
            const userName = userDisplay ? userDisplay.innerText.trim() : 'LOGIN';

            if (!userName || userName === 'LOGIN') {
                alert("You must be logged in to post a review!");
                closeReviewModal();
                
                // Automatically open the login modal if available
                const loginModal = document.getElementById('login-modal-overlay');
                if (loginModal) loginModal.classList.remove('hidden');
                return;
            }

            const commentInput = document.getElementById('review-comment');
            const commentText = commentInput ? commentInput.value.trim() : "";
            const values = Object.values(scores);
            const isComplete = values.every(val => val > 0);

            if (!isComplete) {
                alert("Please rate all 5 categories before posting your review!");
                return;
            }

            // Combine/Average all category ratings together into a final score for this review
            const combinedAverageScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

            // 1. Add combined rating row to USER REVIEWS card
            appendUserReview(userName, combinedAverageScore);

            // 2. Add comment block to COMMENT card
>>>>>>> bc464d6a030cf1a153511e72cfc39855eeb8b502
            if (commentText) {
                appendUserComment(userName, commentText);
            }

<<<<<<< HEAD
=======
            // 3. Dynamically recalculate and render the main recipe RATING display card from all reviews
            updateOverallRecipeRating();

>>>>>>> bc464d6a030cf1a153511e72cfc39855eeb8b502
            // Reset modal form
            resetReviewForm(scores);

            alert("Review posted successfully!");
            closeReviewModal();
        });
    }
}

// Updates total stars inside the review modal
function updateModalTotalStars(scores) {
    const values = Object.values(scores);
    const sum = values.reduce((a, b) => a + b, 0);
<<<<<<< HEAD
    const average = Math.round(sum / values.length); // Average rounded to nearest star
=======
    const average = Math.round(sum / values.length);
>>>>>>> bc464d6a030cf1a153511e72cfc39855eeb8b502

    const totalStarsContainer = document.querySelectorAll('#total-stars i');
    totalStarsContainer.forEach((star, index) => {
        if (index < average) {
            star.className = 'fa-solid fa-star text-yellow-500';
        } else {
            star.className = 'fa-regular fa-star text-black/60';
        }
    });
}

<<<<<<< HEAD
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
=======
/**
 * DYNAMIC: Scans all user review entries in the DOM.
 * If there are no reviews, it shows 5 empty outline stars. Otherwise, computes combined average.
 */
function updateOverallRecipeRating() {
    const reviewElements = document.querySelectorAll('main div.border-2.rounded-2xl span.text-yellow-600');
    
    let totalScoreSum = 0;
    let count = 0;

    reviewElements.forEach(span => {
        const text = span.textContent;
        const match = text.match(/([1-5])\/5/);
        if (match) {
            totalScoreSum += parseInt(match[1], 10);
            count++;
        }
    });

    // Find the main RATING card container dynamically
    const ratingCards = document.querySelectorAll('main div.border-2.rounded-2xl');
    let ratingContainer = null;

    ratingCards.forEach(card => {
        const label = card.querySelector('div.bg-\\[\\#C5BE53\\]');
        if (label && label.textContent.includes('RATING')) {
            ratingContainer = card.querySelector('.flex.gap-2.text-3xl') || card.querySelector('#main-rating-stars');
            if (!ratingContainer) {
                ratingContainer = document.createElement('div');
                ratingContainer.className = 'flex gap-2 text-3xl text-yellow-500';
                card.appendChild(ratingContainer);
            }
        }
    });

    if (ratingContainer) {
        let starsHTML = '';
        if (count === 0) {
            // If no reviews exist, render 5 empty outline stars
            for (let i = 1; i <= 5; i++) {
                starsHTML += `<i class="fa-regular fa-star text-black/60"></i>`;
            }
        } else {
            // Otherwise, calculate combined average and render filled/empty stars
            const overallAverage = Math.round(totalScoreSum / count);
            for (let i = 1; i <= 5; i++) {
                if (i <= overallAverage) {
                    starsHTML += `<i class="fa-solid fa-star drop-shadow-sm text-yellow-500"></i>`;
                } else {
                    starsHTML += `<i class="fa-regular fa-star text-black/60"></i>`;
                }
            }
        }
        ratingContainer.innerHTML = starsHTML;
    }
}

// Append combined rating matching the USER REVIEWS card design
function appendUserReview(name, rating) {
    const reviewsContainer = document.querySelector('main div.border-2.rounded-2xl:nth-of-type(2) div.mt-4') 
        || document.querySelectorAll('main div.border-2.rounded-2xl')[1]?.querySelector('div.mt-4');

    if (reviewsContainer) {
        const filledStars = '<i class="fa-solid fa-star"></i>'.repeat(rating);
        const emptyStars = '<i class="fa-regular fa-star text-black/60"></i>'.repeat(5 - rating);
        
        const newReviewRow = document.createElement('div');
        newReviewRow.className = 'flex justify-between items-center border-b border-black/10 pb-1';
        newReviewRow.innerHTML = `
            <span>• ${name.toUpperCase()}</span>
            <span class="text-yellow-600">${filledStars}${emptyStars} ${rating}/5</span>
        `;
        reviewsContainer.appendChild(newReviewRow);
    }
}

// Append new comment matching the COMMENT card design
function appendUserComment(name, comment) {
    const commentContainer = document.querySelector('main div.border-2.rounded-2xl:nth-of-type(3) div.mt-4') 
        || document.querySelectorAll('main div.border-2.rounded-2xl')[2]?.querySelector('div.mt-4');

    if (commentContainer) {
        const newCommentBox = document.createElement('div');
        newCommentBox.className = 'space-y-2 mt-4 pt-3 border-t border-black/10';
>>>>>>> bc464d6a030cf1a153511e72cfc39855eeb8b502
        newCommentBox.innerHTML = `
            <p class="font-bold">• ${name.toUpperCase()}</p>
            <p class="pl-4 text-black/90 font-['Georgia'] tracking-normal lowercase text-sm sm:text-base">
                - "${comment}"
            </p>
        `;
<<<<<<< HEAD
        commentContainer.prepend(newCommentBox);
=======
        commentContainer.appendChild(newCommentBox);
>>>>>>> bc464d6a030cf1a153511e72cfc39855eeb8b502
    }
}

// Reset review stars and textarea
function resetReviewForm(scores) {
    Object.keys(scores).forEach(key => scores[key] = 0);
    document.querySelectorAll('.category-rating i').forEach(star => {
        star.className = 'fa-regular fa-star text-black/60';
    });
<<<<<<< HEAD
    updateTotalStars(scores);
=======
    updateModalTotalStars(scores);
>>>>>>> bc464d6a030cf1a153511e72cfc39855eeb8b502
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
<<<<<<< HEAD
}
=======
}
>>>>>>> bc464d6a030cf1a153511e72cfc39855eeb8b502
