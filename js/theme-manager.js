class ThemeManager {
    constructor() {
        this.themeKey = 'universal_tool_theme';
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem(this.themeKey);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme(prefersDark ? 'dark' : 'light');
        }

        // Expose toggle function globally if needed
        window.toggleTheme = () => this.toggle();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.themeKey, theme);
        this.updateIcon(theme);
    }

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
    }

    updateIcon(theme) {
        const icon = document.getElementById('theme-icon');
        if (icon) {
            // Check if lucide is available (it might load async)
            if (window.lucide) {
                // We rely on re-rendering icons or swapping SVG content
                // Simpler approach: toggle class or swap innerHTML if not using lucide.createIcons
            }
        }
    }
}

// Initialize on load
const themeManager = new ThemeManager();
