/**
 * Core Application Controller for Cosmic English AI
 */

// STATE MANAGEMENT (Shared globally)
let state = {
    posts: [],
    currentUser: null,       // { username, role }
    readHistory: [],         // Array of post IDs read by Guest
    selectedCategory: 'all',
    isRegisterMode: false
};

// DOM ELEMENTS (Shared globally)
let el = {};

function initDOMRefs() {
    el.articlesGrid = document.getElementById('articlesGrid');
    el.homeView = document.getElementById('homeView');
    el.detailView = document.getElementById('detailView');
    el.navMenu = document.getElementById('navMenu');
    el.freeReadCounter = document.getElementById('freeReadCounter');
    el.categoryTabs = document.getElementById('categoryTabs');
    
    el.detailTitle = document.getElementById('detailTitle');
    el.detailCategory = document.getElementById('detailCategory');
    el.detailDate = document.getElementById('detailDate');
    el.detailContent = document.getElementById('articleMainContent');
    el.detailPrompt = document.getElementById('detailPrompt');
    
    el.paywallOverlay = document.getElementById('paywallOverlay');
    el.articleMainContent = document.getElementById('articleMainContent');
    el.articlePromptCard = document.getElementById('articlePromptCard');
    
    el.authModal = document.getElementById('authModal');
    el.authModalTitle = document.getElementById('authModalTitle');
    el.authForm = document.getElementById('authForm');
    el.authUsername = document.getElementById('authUsername');
    el.authPassword = document.getElementById('authPassword');
    el.btnAuthSubmit = document.getElementById('btnAuthSubmit');
    el.authToggleText = document.getElementById('authToggleText');
    
    el.adminPanelContainer = document.getElementById('adminPanelContainer');
    el.toast = document.getElementById('toastMessage');
    el.toastText = document.getElementById('toastText');
}

// INITIALIZE APP ON LOAD
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initDOMRefs();
        initData();
        checkSessionUser();
        renderHeader();
        renderArticles();
        updateCounterBadge();

        // Set up Categories Filter Tabs
        el.categoryTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-tab')) {
                document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
                e.target.classList.add('active');
                state.selectedCategory = e.target.getAttribute('data-cat');
                renderArticles();
            }
        });

        // Set up Admin Publish click event
        document.getElementById('btnSavePost').addEventListener('click', handleCreatePost);

        // Prompt Copy Button click event
        document.getElementById('btnCopyPrompt').addEventListener('click', () => {
            const text = el.detailPrompt.innerText;
            navigator.clipboard.writeText(text).then(() => {
                showToast('Đã copy Prompt AI vào Clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast('Đã copy Prompt AI (fallback)!');
            });
        });
    });
}

// RETURN TO MAIN HOMEPAGE
function backToHome() {
    el.detailView.style.display = 'none';
    el.homeView.style.display = 'block';
    renderArticles();
}

// VIEW NAVIGATION / SCROLLING HELPERS
function scrollToGrid() {
    document.getElementById('categoryTabs').scrollIntoView({ behavior: 'smooth' });
}

// SCROLL TO ADMIN PANEL
function scrollToAdmin() {
    el.adminPanelContainer.scrollIntoView({ behavior: 'smooth' });
}

// UTILITIES: TOAST NOTIFICATIONS
function showToast(message) {
    el.toastText.innerText = message;
    el.toast.classList.add('show');
    setTimeout(() => {
        el.toast.classList.remove('show');
    }, 3000);
}

// Re-export parseMarkdown for Node unit tests to maintain compatibility
if (typeof module !== 'undefined' && module.exports) {
    const { parseMarkdown } = require('./markdown.js');
    module.exports = { parseMarkdown };
}
