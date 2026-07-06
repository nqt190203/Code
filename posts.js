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
        const isLocked = !state.currentUser && state.readHistory.length >= 3 && !state.readHistory.includes(post.id);
        
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
    const limitReached = state.readHistory.length >= 3;

    if (isGuest && limitReached && !hasReadBefore) {
        // Locked state (4th article viewed by Guest)
        el.articleMainContent.classList.add('paywall-blur');
        el.articlePromptCard.style.display = 'none';
        el.paywallOverlay.style.display = 'flex';
    } else {
        // Unlocked state (Authorized user OR within 3 free guest articles)
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
        el.freeReadCounter.innerText = `🎯 Lượt xem miễn phí: ${count}/3 bài`;
        if (count >= 3) {
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
        content: content, // stored as raw text, parsed to HTML dynamically
        ai_prompt: promptVal || "Không có Prompt đi kèm bài viết này.",
        created_at: new Date().toISOString(),
        status: "Published"
    };

    state.posts.unshift(newPost); // Prepend to lists
    localStorage.setItem('cosmic_posts', JSON.stringify(state.posts));
    showToast("Đăng bài viết mới thành công!");
    clearAdminForm();
    renderArticles();
    
    // Scroll view back to home grid categories
    window.scrollTo(0, el.categoryTabs.offsetTop - 100);
}

// CLEAR ADMIN FORM
function clearAdminForm() {
    document.getElementById('adminTitle').value = '';
    document.getElementById('adminSummary').value = '';
    document.getElementById('adminContent').value = '';
    document.getElementById('adminPrompt').value = '';
}
