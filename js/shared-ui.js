// Shared UI components (Header injection, Icons)

document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    initIcons();
});

function injectHeader() {
    const headerContainer = document.getElementById('app-header-container');
    if (!headerContainer) return; // Only run if placeholder exists (on tool pages)

    const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const backLink = isHome ? '#' : '../../index.html';
    const backStyle = isHome ? 'visibility: hidden;' : '';

    const headerHTML = `
    <header class="app-header">
        <div class="container" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
            <a href="${backLink}" class="btn-secondary" style="${backStyle} padding: 0.5rem 1rem;">
                <i data-lucide="arrow-left"></i> Back to Hub
            </a>

            <div class="header-brand">
                <i data-lucide="box" style="color: var(--accent-primary);"></i>
                <span>Universal Tool</span>
            </div>

            <button id="theme-toggle-btn" class="theme-toggle" aria-label="Toggle Theme">
                <i data-lucide="sun-moon"></i>
            </button>
        </div>
    </header>
    `;

    headerContainer.innerHTML = headerHTML;

    // Attach event listener to new button
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        if (window.toggleTheme) window.toggleTheme();
    });
}

function initIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    } else {
        // Retry if script hasn't loaded yet
        setTimeout(initIcons, 100);
    }
}
