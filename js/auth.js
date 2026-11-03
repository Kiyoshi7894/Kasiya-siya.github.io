// js/auth.js

export function initAuth() {
    const loginModal = document.getElementById("login-modal-overlay");
    const openLoginBtn = document.getElementById("open-login-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const authForm = document.getElementById("auth-form");
    
    const formTitle = document.getElementById("form-title");
    const submitBtn = document.getElementById("submit-btn");
    const toggleAuthMode = document.getElementById("toggle-auth-mode");
    const togglePrompt = document.getElementById("toggle-prompt");
    const signupExtraFields = document.getElementById("signup-extra-fields");
    const loginOptions = document.getElementById("login-options");
    
    const emailInput = document.getElementById("email-input");
    const userDisplayName = document.getElementById("user-display-name");
    const logoutBtn = document.getElementById("logout-btn");

    let isLoginMode = true;

    const checkActiveUser = () => {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
            if (userDisplayName) userDisplayName.textContent = savedUser;
            if (logoutBtn) logoutBtn.classList.remove("hidden");
            if (openLoginBtn) openLoginBtn.onclick = null;
        } else {
            if (userDisplayName) userDisplayName.textContent = "LOGIN";
            if (logoutBtn) logoutBtn.classList.add("hidden");
            if (openLoginBtn) openLoginBtn.onclick = openModal;
        }
    };

    const openModal = () => {
        if (loginModal) loginModal.classList.remove("hidden");
    };

    const closeModal = () => {
        if (loginModal) loginModal.classList.add("hidden");
    };

    if (openLoginBtn) {
        openLoginBtn.addEventListener("click", () => {
            if (!localStorage.getItem("currentUser")) {
                openModal();
            }
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

    if (loginModal) {
        loginModal.addEventListener("click", (e) => {
            if (e.target === loginModal) {
                closeModal();
            }
        });
    }

    if (toggleAuthMode) {
        toggleAuthMode.addEventListener("click", (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;

            if (isLoginMode) {
                if (formTitle) formTitle.textContent = "Login Form";
                if (submitBtn) submitBtn.textContent = "Login";
                if (togglePrompt) togglePrompt.textContent = "Not a member?";
                if (toggleAuthMode) toggleAuthMode.textContent = "Signup now";
                if (signupExtraFields) signupExtraFields.classList.add("hidden");
                if (loginOptions) loginOptions.classList.remove("hidden");
            } else {
                if (formTitle) formTitle.textContent = "Signup Form";
                if (submitBtn) submitBtn.textContent = "Signup";
                if (togglePrompt) togglePrompt.textContent = "Already a member?";
                if (toggleAuthMode) toggleAuthMode.textContent = "Login now";
                if (signupExtraFields) signupExtraFields.classList.remove("hidden");
                if (loginOptions) loginOptions.classList.add("hidden");
            }
        });
    }

    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (isLoginMode) {
                const username = email.split("@")[0];
                localStorage.setItem("currentUser", username);
                alert(`Welcome back, ${username}!`);
            } else {
                const fullNameElement = document.getElementById("full-name-input");
                const fullName = (fullNameElement ? fullNameElement.value.trim() : "") || email.split("@")[0];
                localStorage.setItem("currentUser", fullName);
                alert(`Account created! Welcome, ${fullName}.`);
            }

            authForm.reset();
            closeModal();
            checkActiveUser();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            localStorage.removeItem("currentUser");
            alert("Logged out successfully.");
            checkActiveUser();
        });
    }

    checkActiveUser();
}