// ===================================
// ALL-IN-ONE POCKET - MAIN SCRIPT
// ===================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 All-in-one Pocket initialized!');
    
    // Get all tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    
    // Add click handlers to tool cards
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const toolName = card.dataset.tool;
            handleToolClick(toolName, card);
        });
    });
    
    // Add hover sound effect (optional - can be enabled later)
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Subtle scale animation already handled by CSS
            // Can add sound effects here later
        });
    });
});

// Handle tool card clicks
function handleToolClick(toolName, cardElement) {
    console.log(`Clicked: ${toolName}`);
    
    // Check if tool is available
    const badge = cardElement.querySelector('.tool-badge');
    
    if (badge && badge.textContent === 'Coming Soon') {
        // Show coming soon message
        showNotification('This tool is coming soon! 🚀', 'info');
    } else {
        // Navigate to tool page (will be implemented later)
        window.location.href = `tools/${toolName}.html`;
    }
}

// Show notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: 'rgba(0, 217, 255, 0.9)',
        color: '#001F3F',
        borderRadius: '12px',
        fontWeight: '600',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        backdropFilter: 'blur(10px)'
    });
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Console welcome message
console.log(`
%c🚀 All-in-one Pocket %cv1.0.0
%cMade by ShifoSan | 2025
%cGitHub: https://github.com/ShifoSan/All-in-one-Pocket
`,
'color: #00D9FF; font-size: 24px; font-weight: bold;',
'color: #B388FF; font-size: 14px;',
'color: #F4E5C2; font-size: 12px;',
'color: #00D9FF; font-size: 12px;'
);