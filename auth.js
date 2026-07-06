/**
 * Authentication Module for Cosmic English AI
 */

// CHECK LOGGED-IN SESSION
function checkSessionUser() {
    const user = sessionStorage.getItem('cosmic_current_user');
    if (user) {
        state.currentUser = JSON.parse(user);
    }
}

// RENDER NAVIGATION HEADER & STATUS
function renderHeader() {
    if (state.currentUser) {
        const isAdmin = state.currentUser.role === 'Admin';
        el.navMenu.innerHTML = `
            <div class="user-badge">
                <span class="avatar-dot"></span>
                Chào <strong>${state.currentUser.username}</strong> (${isAdmin ? 'Admin' : 'Thành viên'})
            </div>
            ${isAdmin ? '<button class="btn btn-outline" onclick="scrollToAdmin()">🛠️ Admin</button>' : ''}
            <button class="btn btn-danger" onclick="handleLogout()">Đăng xuất</button>
        `;
        if (isAdmin) {
            el.adminPanelContainer.style.display = 'block';
        } else {
            el.adminPanelContainer.style.display = 'none';
        }
    } else {
        el.navMenu.innerHTML = `
            <button class="btn btn-outline" onclick="showAuthModal(false)">Đăng Nhập</button>
            <button class="btn btn-primary" onclick="showAuthModal(true)">Đăng Ký</button>
        `;
        el.adminPanelContainer.style.display = 'none';
    }
}

// AUTH MODAL TRIGGERS
function showAuthModal(isRegister = false) {
    state.isRegisterMode = isRegister;
    el.authModal.classList.add('show');
    toggleAuthMode(isRegister);
}

// CLOSE AUTH MODAL
function closeAuthModal() {
    el.authModal.classList.remove('show');
    el.authForm.reset();
}

// TOGGLE REGISTRATION OR LOGIN VIEW IN MODAL
function toggleAuthMode(isRegister) {
    state.isRegisterMode = isRegister;
    if (isRegister) {
        el.authModalTitle.innerText = "Đăng Ký Thành Viên";
        el.btnAuthSubmit.innerText = "Đăng Ký Mới";
        el.authToggleText.innerHTML = `Đã có tài khoản? <a href="#" onclick="toggleAuthMode(false)">Đăng nhập ngay</a>`;
    } else {
        el.authModalTitle.innerText = "Mở Khóa Cosmic Portal";
        el.btnAuthSubmit.innerText = "Đăng Nhập";
        el.authToggleText.innerHTML = `Chưa có tài khoản? <a href="#" onclick="toggleAuthMode(true)">Đăng ký miễn phí</a>`;
    }
}

// FORM SUBMISSION (LOGIN / REGISTER) (BR-03)
function handleAuthSubmit(event) {
    event.preventDefault();
    const username = el.authUsername.value.trim();
    const password = el.authPassword.value;

    if (!username || !password) return;

    let users = JSON.parse(localStorage.getItem('cosmic_users')) || [];

    if (state.isRegisterMode) {
        // Handle User Registration
        const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (exists) {
            alert("Tên đăng nhập này đã tồn tại!");
            return;
        }

        const newUser = {
            username: username,
            password: password,
            role: username.toLowerCase() === 'admin' ? 'Admin' : 'User'
        };
        users.push(newUser);
        localStorage.setItem('cosmic_users', JSON.stringify(users));
        
        state.currentUser = newUser;
        sessionStorage.setItem('cosmic_current_user', JSON.stringify(newUser));
        showToast("Đăng ký tài khoản thành công!");
    } else {
        // Handle Login Authentication
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        if (!user) {
            alert("Tài khoản hoặc mật khẩu không chính xác!");
            return;
        }

        state.currentUser = user;
        sessionStorage.setItem('cosmic_current_user', JSON.stringify(user));
        showToast("Đăng nhập thành công!");
    }

    // Close auth screen and refresh layouts
    closeAuthModal();
    renderHeader();
    updateCounterBadge();
    
    // Unlock detailed article contents if viewing a blurred page
    if (el.detailView.style.display === 'block') {
        el.articleMainContent.classList.remove('paywall-blur');
        el.articlePromptCard.style.display = 'block';
        el.paywallOverlay.style.display = 'none';
    }
    renderArticles();
}

// ACCOUNT LOGOUT
function handleLogout() {
    sessionStorage.removeItem('cosmic_current_user');
    state.currentUser = null;
    
    // Reset guest read history when logging out, returning to locked view rules
    state.readHistory = [];
    localStorage.setItem('cosmic_read_history', JSON.stringify(state.readHistory));
    
    showToast("Đã đăng xuất tài khoản.");
    renderHeader();
    updateCounterBadge();
    backToHome();
}
