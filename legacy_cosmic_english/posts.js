/**
 * Posts and Paywall Management Module for Cosmic English AI
 */

// LOAD DATA FROM LOCAL STORAGE
function initData() {
    // Check for posts database
    const storedPosts = localStorage.getItem('cosmic_posts');
    if (storedPosts) {
        state.posts = JSON.parse(storedPosts);
    } else {
        state.posts = DEFAULT_POSTS;
        localStorage.setItem('cosmic_posts', JSON.stringify(DEFAULT_POSTS));
    }

    // Initialize default users if not exists
    const storedUsers = localStorage.getItem('cosmic_users');
    if (!storedUsers) {
        localStorage.setItem('cosmic_users', JSON.stringify(DEFAULT_USERS));
    }

    // Load persistent read history for Guests (lưu trữ vĩnh viễn)
    const history = localStorage.getItem('cosmic_read_history');
    if (history) {
        state.readHistory = JSON.parse(history);
    } else {
        state.readHistory = [];
        localStorage.setItem('cosmic_read_history', JSON.stringify([]));
    }

    // Load dynamic paywall limit
    const limit = localStorage.getItem('cosmic_paywall_limit');
    state.paywallLimit = limit ? parseInt(limit, 10) : 3;

    // Initialize admin states
    state.adminActiveView = 'dashboard';
    state.adminSearchQuery = '';
    state.adminCurrentPage = 1;
    state.adminPageSize = 5; // 5 records per page for clean pagination
}

// RENDER HOMEPAGE ARTICLES GRID
function renderArticles() {
    el.articlesGrid.innerHTML = '';
    
    const filtered = state.selectedCategory === 'all' 
        ? state.posts 
        : state.posts.filter(p => p.category === state.selectedCategory);
    
    if (filtered.length === 0) {
        el.articlesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">
                Không có bài học nào trong danh mục này.
            </div>`;
        return;
    }

    filtered.forEach(post => {
        // Evaluate paywall constraint on the card
        const isLocked = !state.currentUser && state.readHistory.length >= state.paywallLimit && !state.readHistory.includes(post.id);
        
        const card = document.createElement('div');
        card.className = `card ${isLocked ? 'locked-style' : ''}`;
        card.id = `card-${post.id}`;
        
        // Date formatting
        const dateObj = new Date(post.created_at);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

        card.innerHTML = `
            <div>
                <div class="card-header">
                    <span class="card-category">${post.category}</span>
                    <span class="card-date">${formattedDate}</span>
                </div>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-summary">${post.summary}</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-outline" style="padding: 0.5rem 1.2rem; font-size: 0.9rem;" onclick="viewPostDetail('${post.id}')">
                    Xem chi tiết &rarr;
                </button>
                <span class="card-lock-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                    Khóa
                </span>
            </div>
        `;
        el.articlesGrid.appendChild(card);
    });
}

// VIEW POST DETAIL & IMPLEMENT PAYWALL RULES (BR-01, BR-02)
function viewPostDetail(postId) {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;

    // Load post content fields
    el.detailTitle.innerText = post.title;
    el.detailCategory.innerText = post.category;
    
    const dateObj = new Date(post.created_at);
    el.detailDate.innerText = `Đăng ngày: ${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    
    // Parse markdown description into HTML
    el.detailContent.innerHTML = parseMarkdown(post.content);
    el.detailPrompt.innerText = post.ai_prompt;

    // Paywall verification rules
    const isGuest = !state.currentUser;
    const hasReadBefore = state.readHistory.includes(postId);
    const limitReached = state.readHistory.length >= state.paywallLimit;

    if (isGuest && limitReached && !hasReadBefore) {
        // Locked state (limit reached for Guest)
        el.articleMainContent.classList.add('paywall-blur');
        el.articlePromptCard.style.display = 'none';
        
        // Update overlay text dynamically
        const overlayDesc = el.paywallOverlay.querySelector('p');
        if (overlayDesc) {
            overlayDesc.innerText = `Bạn đã sử dụng hết ${state.paywallLimit} lượt xem miễn phí dành cho khách vãng lai. Vui lòng đăng nhập hoặc đăng ký tài khoản (miễn phí) để mở khóa cổng tri thức.`;
        }
        el.paywallOverlay.style.display = 'flex';
    } else {
        // Unlocked state (Authorized user OR within free guest limit)
        el.articleMainContent.classList.remove('paywall-blur');
        el.articlePromptCard.style.display = 'block';
        el.paywallOverlay.style.display = 'none';

        // Log guest view history persistently
        if (isGuest && !hasReadBefore) {
            state.readHistory.push(postId);
            localStorage.setItem('cosmic_read_history', JSON.stringify(state.readHistory));
            updateCounterBadge();
            renderArticles(); // Redraw homepage locks
        }
    }

    // If detail view triggered from within admin list, make sure to hide admin layout
    const adminDashboardView = document.getElementById('adminDashboardView');
    if (adminDashboardView) adminDashboardView.style.display = 'none';

    el.homeView.style.display = 'none';
    el.detailView.style.display = 'block';
    window.scrollTo(0,0);
}

// UPDATE FREE READ COUNTER OR VIP STATUS INDICATOR
function updateCounterBadge() {
    const count = state.readHistory.length;
    if (state.currentUser) {
        el.freeReadCounter.innerText = `🌌 Vô hạn lượt xem (Thành viên)`;
        el.freeReadCounter.style.background = 'rgba(0, 242, 254, 0.15)';
        el.freeReadCounter.style.border = '1px solid rgba(0, 242, 254, 0.4)';
    } else {
        el.freeReadCounter.innerText = `🎯 Lượt xem miễn phí: ${count}/${state.paywallLimit} bài`;
        if (count >= state.paywallLimit) {
            el.freeReadCounter.style.background = 'rgba(239, 68, 68, 0.15)';
            el.freeReadCounter.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        } else {
            el.freeReadCounter.style.background = 'rgba(236, 56, 188, 0.15)';
            el.freeReadCounter.style.border = '1px solid rgba(236, 56, 188, 0.3)';
        }
    }
}

// CREATE POST ACTION (ADMIN PRIVILEGE ONLY) (BR-04)
function handleCreatePost() {
    const title = document.getElementById('adminTitle').value.trim();
    const category = document.getElementById('adminCategory').value;
    const summary = document.getElementById('adminSummary').value.trim();
    const content = document.getElementById('adminContent').value.trim();
    const promptVal = document.getElementById('adminPrompt').value.trim();

    if (!title || !summary || !content) {
        alert("Vui lòng điền đầy đủ Tiêu đề, Tóm tắt và Nội dung!");
        return;
    }

    const newPost = {
        id: `post-${Date.now()}`,
        title: title,
        category: category,
        summary: summary,
        content: content,
        ai_prompt: promptVal || "Không có Prompt đi kèm bài viết này.",
        created_at: new Date().toISOString(),
        status: "Published"
    };

    state.posts.unshift(newPost);
    localStorage.setItem('cosmic_posts', JSON.stringify(state.posts));
    showToast("Đăng bài viết mới thành công!");
    clearAdminForm();
    
    // Auto redirect back to posts-list subview
    switchAdminView('posts-list');
}

// CLEAR ADMIN FORM
function clearAdminForm() {
    const adminTitle = document.getElementById('adminTitle');
    const adminSummary = document.getElementById('adminSummary');
    const adminContent = document.getElementById('adminContent');
    const adminPrompt = document.getElementById('adminPrompt');
    if (adminTitle) adminTitle.value = '';
    if (adminSummary) adminSummary.value = '';
    if (adminContent) adminContent.value = '';
    if (adminPrompt) adminPrompt.value = '';
}


/* ==========================================================================
   ADMIN PORTAL CORE RENDER LOGIC (DASHBOARD & SUBVIEWS)
   ========================================================================== */

// MASTER CONTROLLER TO SWITCH ADMIN VIEWS
function switchAdminView(viewName) {
    state.adminActiveView = viewName;
    state.adminSearchQuery = '';
    state.adminCurrentPage = 1;
    
    // Toggle active state in sidebar
    document.querySelectorAll('.nav-item, .submenu-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
            
            // Expand parent menu if it is a submenu item
            const parentMenu = item.closest('.nav-menu');
            if (parentMenu) {
                parentMenu.classList.add('open');
            }
        }
    });

    renderAdminPanel();
}

// RENDER ADMIN PANEL DYNAMIC CONTENT
function renderAdminPanel() {
    const contentArea = document.getElementById('adminPanelContent');
    const headerActions = document.getElementById('adminPanelHeaderActions');
    const panelTitle = document.getElementById('adminPanelTitle');
    const panelSubtitle = document.getElementById('adminPanelSubtitle');

    if (!contentArea) return;

    // Reset action header
    headerActions.innerHTML = '';

    switch (state.adminActiveView) {
        case 'dashboard':
            panelTitle.innerText = "Tổng Quan Hệ Thống";
            panelSubtitle.innerText = "Số liệu thống kê hoạt động cổng học tập.";
            renderDashboardStats(contentArea);
            break;
            
        case 'posts-list':
            panelTitle.innerText = "Quản lý Bài học";
            panelSubtitle.innerText = "Danh sách tất cả bài viết trên hệ thống.";
            headerActions.innerHTML = `<button class="btn btn-primary" onclick="switchAdminView('posts-new')">➕ Đăng bài mới</button>`;
            renderPostsListSubpanel(contentArea);
            break;
            
        case 'posts-new':
            panelTitle.innerText = "Đăng bài học mới";
            panelSubtitle.innerText = "Thêm một bài học AI hoặc kỹ năng tiếng Anh mới.";
            renderNewPostForm(contentArea);
            break;
            
        case 'users-list':
            panelTitle.innerText = "Danh sách học viên";
            panelSubtitle.innerText = "Quản lý tài khoản đăng ký trên Cosmic Portal.";
            renderUsersListSubpanel(contentArea);
            break;
            
        case 'settings-paywall':
            panelTitle.innerText = "Cấu hình Hệ thống";
            panelSubtitle.innerText = "Điều chỉnh các thông số cổng học tập và Paywall.";
            renderPaywallSettingsSubpanel(contentArea);
            break;

        default:
            break;
    }
}

// 1. RENDER DASHBOARD KPI & MOCK DETAILS
function renderDashboardStats(container) {
    const users = JSON.parse(localStorage.getItem('cosmic_users')) || [];
    
    container.innerHTML = `
        <!-- KPI Cards Grid -->
        <div class="kpi-grid">
            <div class="kpi-card">
                <div>
                    <div class="kpi-label">Tổng bài viết</div>
                    <div class="kpi-value">${state.posts.length}</div>
                </div>
                <div class="kpi-icon">📚</div>
            </div>
            
            <div class="kpi-card">
                <div>
                    <div class="kpi-label">Học viên đăng ký</div>
                    <div class="kpi-value">${users.length}</div>
                </div>
                <div class="kpi-icon">👥</div>
            </div>

            <div class="kpi-card">
                <div>
                    <div class="kpi-label">Lượt xem của Khách</div>
                    <div class="kpi-value">${state.readHistory.length}</div>
                </div>
                <div class="kpi-icon">🎯</div>
            </div>
        </div>

        <!-- Quick Summary Table -->
        <div class="table-container" style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem; font-family: var(--font-display); font-weight: 700; color: #fff; font-size: 1.1rem;">Bài viết mới đăng gần đây</h3>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Tiêu đề bài viết</th>
                        <th>Chuyên mục</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.posts.slice(0, 3).map(post => {
                        const dateObj = new Date(post.created_at);
                        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
                        return `
                            <tr>
                                <td style="font-weight: 600;">${post.title}</td>
                                <td><span style="color: var(--secondary-glow);">${post.category}</span></td>
                                <td>${formattedDate}</td>
                                <td><span class="badge badge-active">Hoạt động</span></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 2. RENDER POSTS LIST TABLE (WITH SEARCH, PAGINATION & ACTIONS)
function renderPostsListSubpanel(container) {
    // Apply search filter
    const query = state.adminSearchQuery.toLowerCase();
    const filtered = state.posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.category.toLowerCase().includes(query) || 
        post.summary.toLowerCase().includes(query)
    );

    // Calculate pagination details
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / state.adminPageSize) || 1;
    if (state.adminCurrentPage > totalPages) state.adminCurrentPage = totalPages;
    const startIndex = (state.adminCurrentPage - 1) * state.adminPageSize;
    const paginated = filtered.slice(startIndex, startIndex + state.adminPageSize);

    container.innerHTML = `
        <div class="table-container">
            <!-- Search & Actions bar -->
            <div class="table-header-row">
                <input type="text" 
                       id="postsSearchInput" 
                       class="form-input table-search-input" 
                       placeholder="🔍 Tìm kiếm bài viết..." 
                       value="${state.adminSearchQuery}"
                       oninput="handleAdminPostsSearch(this.value)">
                <div style="font-size: 0.85rem; color: var(--text-muted);">
                    Tìm thấy: <strong>${totalRecords}</strong> bài viết
                </div>
            </div>

            <!-- Data Table -->
            <table class="admin-table">
                <thead>
                    <tr>
                        <th style="width: 5%">#</th>
                        <th style="width: 45%">Tiêu đề bài viết</th>
                        <th style="width: 20%">Chuyên mục</th>
                        <th style="width: 15%">Ngày tạo</th>
                        <th style="width: 15%">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginated.length === 0 ? `
                        <tr>
                            <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                                Không tìm thấy bài viết phù hợp.
                            </td>
                        </tr>
                    ` : paginated.map((post, idx) => {
                        const dateObj = new Date(post.created_at);
                        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
                        return `
                            <tr>
                                <td>${startIndex + idx + 1}</td>
                                <td style="font-weight: 600;">${post.title}</td>
                                <td><span style="color: var(--secondary-glow);">${post.category}</span></td>
                                <td>${formattedDate}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn btn-outline btn-sm" onclick="viewPostDetail('${post.id}')">👁️</button>
                                        <button class="btn btn-danger btn-sm" onclick="deleteAdminPost('${post.id}')">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <!-- Pagination footer -->
            <div class="table-footer">
                <div>
                    Hiển thị ${paginated.length} / ${totalRecords} bản ghi
                </div>
                <div class="pagination-controls">
                    <button class="pagination-btn ${state.adminCurrentPage === 1 ? 'disabled' : ''}" 
                            onclick="changeAdminPostsPage(${state.adminCurrentPage - 1})">&lt;</button>
                    ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
                        <button class="pagination-btn ${state.adminCurrentPage === page ? 'active' : ''}" 
                                onclick="changeAdminPostsPage(${page})">${page}</button>
                    `).join('')}
                    <button class="pagination-btn ${state.adminCurrentPage === totalPages ? 'disabled' : ''}" 
                            onclick="changeAdminPostsPage(${state.adminCurrentPage + 1})">&gt;</button>
                </div>
            </div>
        </div>
    `;
}

// 3. RENDER NEW POST FORM IN DASHBOARD PANEL
function renderNewPostForm(container) {
    container.innerHTML = `
        <div class="admin-form-container">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                <div class="form-group">
                    <label class="form-label" for="adminTitle">Tiêu đề bài viết</label>
                    <input type="text" id="adminTitle" class="form-input" placeholder="Ví dụ: 10 Prompts Luyện Nói Trôi Chảy">
                </div>
                <div class="form-group">
                    <label class="form-label" for="adminCategory">Chuyên mục</label>
                    <select id="adminCategory" class="form-input">
                        <option value="AI Prompts">AI Prompts</option>
                        <option value="Grammar">Ngữ pháp</option>
                        <option value="Vocabulary">Từ vựng</option>
                        <option value="Methods">Phương pháp</option>
                        <option value="AI Tools Review">Đánh giá công cụ</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="adminSummary">Tóm tắt ngắn</label>
                <input type="text" id="adminSummary" class="form-input" placeholder="Mô tả ngắn gọn nội dung bài viết...">
            </div>
            <div class="form-group">
                <label class="form-label" for="adminContent">Nội dung chi tiết (Markdown support: #, ##, **, -, \`\`\` )</label>
                <textarea id="adminContent" class="form-input" rows="8" placeholder="Viết bài học tại đây..."></textarea>
            </div>
            <div class="form-group">
                <label class="form-label" for="adminPrompt">AI Prompt đi kèm (Nếu có)</label>
                <textarea id="adminPrompt" class="form-input" rows="4" placeholder="Nhập prompt mẫu hỗ trợ luyện tập..."></textarea>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button class="btn btn-primary" onclick="handleCreatePost()">🚀 Đăng bài viết</button>
                <button class="btn btn-outline" onclick="clearAdminForm()">🔄 Nhập lại</button>
                <button class="btn btn-outline" style="border-color: rgba(255, 255, 255, 0.15);" onclick="switchAdminView('posts-list')">Hủy bỏ</button>
            </div>
        </div>
    `;
}

// 4. RENDER USERS LIST (WITH SEARCH, STATUS TOGGLES, ACCOUNT DELETION)
function renderUsersListSubpanel(container) {
    const users = JSON.parse(localStorage.getItem('cosmic_users')) || [];
    const query = state.adminSearchQuery.toLowerCase();
    
    // Filter users
    const filtered = users.filter(user => 
        user.username.toLowerCase().includes(query) || 
        user.role.toLowerCase().includes(query)
    );

    container.innerHTML = `
        <div class="table-container">
            <!-- Search bar -->
            <div class="table-header-row">
                <input type="text" 
                       id="usersSearchInput" 
                       class="form-input table-search-input" 
                       placeholder="🔍 Tìm kiếm học viên..." 
                       value="${state.adminSearchQuery}"
                       oninput="handleAdminUsersSearch(this.value)">
                <div style="font-size: 0.85rem; color: var(--text-muted);">
                    Đăng ký: <strong>${filtered.length}</strong> học viên
                </div>
            </div>

            <!-- User Data Table -->
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Tên đăng nhập</th>
                        <th>Chức vụ / Quyền</th>
                        <th>Trạng thái</th>
                        <th>Hành động quản trị</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.length === 0 ? `
                        <tr>
                            <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                                Không tìm thấy học viên phù hợp.
                            </td>
                        </tr>
                    ` : filtered.map(user => {
                        const isUserAdmin = user.role === 'Admin';
                        return `
                            <tr>
                                <td style="font-weight: 600;">${user.username}</td>
                                <td>
                                    <span class="badge ${isUserAdmin ? 'badge-admin' : 'badge-member'}">${user.role}</span>
                                </td>
                                <td>
                                    <span class="badge badge-active">Đang hoạt động</span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        ${isUserAdmin ? `
                                            <span style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">Quyền Admin tối cao</span>
                                        ` : `
                                            <button class="btn btn-outline btn-sm" onclick="changeUserRole('${user.username}')">Lên Admin</button>
                                            <button class="btn btn-danger btn-sm" onclick="deleteAdminUser('${user.username}')">Xóa tài khoản</button>
                                        `}
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// 5. RENDER PAYWALL CONFIGURATION & SYSTEM SETTINGS
function renderPaywallSettingsSubpanel(container) {
    container.innerHTML = `
        <div class="admin-form-container" style="max-width: 600px;">
            <h3 style="margin-bottom: 1.5rem; font-family: var(--font-display); color: #fff; font-size: 1.2rem;">Cấu hình Cổng Học Tập & Paywall</h3>
            
            <div class="form-group" style="margin-bottom: 2rem;">
                <label class="form-label" style="display: flex; justify-content: space-between; font-weight: 600;">
                    <span>Giới hạn lượt đọc miễn phí (Khách vãng lai)</span>
                    <span style="color: var(--primary-glow); font-size: 1.1rem;" id="limitDisplayVal">${state.paywallLimit} bài viết</span>
                </label>
                <p class="text-muted" style="margin-bottom: 0.8rem; font-size: 0.82rem;">Số bài viết mà học viên chưa đăng ký tài khoản có thể đọc miễn phí trước khi bị khóa.</p>
                <input type="range" 
                       id="paywallLimitRange" 
                       min="1" 
                       max="10" 
                       step="1" 
                       value="${state.paywallLimit}" 
                       class="form-input" 
                       style="cursor: pointer; padding: 0;"
                       oninput="document.getElementById('limitDisplayVal').innerText = this.value + ' bài viết'">
            </div>

            <div style="display: flex; gap: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 1.5rem;">
                <button class="btn btn-primary" onclick="savePaywallLimitSetting()">💾 Lưu cấu hình</button>
                <button class="btn btn-outline" onclick="resetGuestReadHistoryGlobal()">🧹 Reset lịch sử đọc của Khách</button>
            </div>
        </div>
    `;
}


/* ==========================================================================
   ADMIN ACTIONS INTERACTIVE OPERATIONS
   ========================================================================== */

// POSTS SEARCH ROUTINES
function handleAdminPostsSearch(val) {
    state.adminSearchQuery = val;
    state.adminCurrentPage = 1;
    renderPostsListSubpanel(document.getElementById('adminPanelContent'));
}

// USERS SEARCH ROUTINES
function handleAdminUsersSearch(val) {
    state.adminSearchQuery = val;
    renderUsersListSubpanel(document.getElementById('adminPanelContent'));
}

// CHANGE PAGE EVENT
function changeAdminPostsPage(page) {
    const totalPages = Math.ceil(state.posts.length / state.adminPageSize) || 1;
    if (page < 1 || page > totalPages) return;
    state.adminCurrentPage = page;
    renderPostsListSubpanel(document.getElementById('adminPanelContent'));
}

// DELETE ARTICLE FROM DATABASE
function deleteAdminPost(postId) {
    if (!confirm("Bạn có chắc chắn muốn xóa bài học này khỏi hệ thống?")) return;
    
    state.posts = state.posts.filter(p => p.id !== postId);
    localStorage.setItem('cosmic_posts', JSON.stringify(state.posts));
    showToast("Đã xóa bài viết thành công!");
    
    // Refresh active list subview
    renderPostsListSubpanel(document.getElementById('adminPanelContent'));
}

// PROMOTE USER TO ADMIN
function changeUserRole(username) {
    if (!confirm(`Bạn có chắc muốn cấp quyền Admin cho tài khoản "${username}"?`)) return;

    let users = JSON.parse(localStorage.getItem('cosmic_users')) || [];
    users = users.map(u => {
        if (u.username.toLowerCase() === username.toLowerCase()) {
            u.role = 'Admin';
        }
        return u;
    });

    localStorage.setItem('cosmic_users', JSON.stringify(users));
    showToast(`Đã thăng cấp tài khoản "${username}" lên Admin.`);
    renderUsersListSubpanel(document.getElementById('adminPanelContent'));
}

// DELETE REGISTERED USER
function deleteAdminUser(username) {
    if (username.toLowerCase() === 'admin') return; // Cannot delete primary admin
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"?`)) return;

    let users = JSON.parse(localStorage.getItem('cosmic_users')) || [];
    users = users.filter(u => u.username.toLowerCase() !== username.toLowerCase());

    localStorage.setItem('cosmic_users', JSON.stringify(users));
    showToast(`Đã xóa tài khoản "${username}" thành công.`);
    renderUsersListSubpanel(document.getElementById('adminPanelContent'));
}

// SAVE PAYWALL LIMIT CONFIG TO LOCAL STORAGE
function savePaywallLimitSetting() {
    const range = document.getElementById('paywallLimitRange');
    if (!range) return;

    const limitVal = parseInt(range.value, 10);
    state.paywallLimit = limitVal;
    localStorage.setItem('cosmic_paywall_limit', limitVal);
    showToast("Cấu hình Paywall đã được lưu!");
    
    updateCounterBadge();
    renderArticles();
}

// RESET HISTORY FOR GUESTS
function resetGuestReadHistoryGlobal() {
    if (!confirm("Bạn có muốn reset toàn bộ lịch sử đọc của các khách vãng lai về 0?")) return;

    state.readHistory = [];
    localStorage.setItem('cosmic_read_history', JSON.stringify([]));
    showToast("Đã reset lịch sử đọc của khách.");
    
    updateCounterBadge();
    renderArticles();
}
