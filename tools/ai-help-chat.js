document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearChatBtn = document.getElementById('clearChat');

    // Generate Session ID
    const sessionId = 'session_' + Date.now();

    // API Endpoint (Placeholder)
    const API_URL = 'https://YOUR-RENDER-SERVICE.onrender.com/api/chat';

    // System Instructions (For context only, backend usually handles this, but we simulate for structure)
    const SYSTEM_INSTRUCTIONS = `
You are a helpful AI assistant for the "All-in-one Pocket" web app. Your role is to help users understand and use the various tools available in the app.

Available Tools in All-in-one Pocket:
... (As defined in requirements) ...
    `;

    // Initialize Chat
    addMessage("Hi! I'm here to help you use the All-in-one Pocket tools. Ask me anything!", 'ai');

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') {
            this.style.height = 'auto';
        }
    });

    // Send Message Logic
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add User Message
        addMessage(message, 'user');
        userInput.value = '';
        userInput.style.height = 'auto';
        userInput.focus();

        // Show Typing Indicator
        const loadingId = showTypingIndicator();

        try {
            // Call API
            // Note: This is a placeholder endpoint provided in the prompt.
            // It will likely fail (404 or connection error) unless the user has set it up.
            // We handle the error gracefully to simulate a response or show error.

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: sessionId
                })
            });

            if (!response.ok) {
                throw new Error('API Error');
            }

            const data = await response.json();
            removeTypingIndicator(loadingId);
            addMessage(data.response, 'ai');

        } catch (error) {
            console.error('Chat Error:', error);
            removeTypingIndicator(loadingId);

            // Fallback response for demo/offline purposes since endpoint is placeholder
            // In a real scenario, we might just show "Error connecting to AI".
            // However, to keep the UI functional for testing, I will add a small note or generic response.
            addMessage("I'm having trouble connecting to my brain (the server endpoint is a placeholder). Please check your connection or configuration.", 'ai');
        }
    }

    // Add Message to UI
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text;

        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);

        scrollToBottom();
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        const id = 'loading-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'ai');
        messageDiv.id = id;

        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.innerHTML = `
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        `;

        messageDiv.appendChild(indicator);
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    clearChatBtn.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        addMessage("Chat cleared. How can I help you now?", 'ai');
    });
});
