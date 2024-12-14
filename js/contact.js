document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.submit-btn');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        }, 2000);
    });

    // File Upload Handling
    const fileInput = document.getElementById('attachment');
    const fileInfo = document.querySelector('.file-info');
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    fileInput.addEventListener('change', function() {
        const files = Array.from(this.files);
        let totalSize = 0;
        let invalidFiles = [];

        files.forEach(file => {
            totalSize += file.size;
            if (!allowedTypes.includes(file.type)) {
                invalidFiles.push(file.name);
            }
        });

        if (totalSize > maxSize) {
            showNotification('Total file size exceeds 10MB limit', 'error');
            this.value = '';
            return;
        }

        if (invalidFiles.length > 0) {
            showNotification('Invalid file type(s): ' + invalidFiles.join(', '), 'error');
            this.value = '';
            return;
        }

        // Update file info text
        if (files.length > 0) {
            fileInfo.textContent = `${files.length} file(s) selected`;
        } else {
            fileInfo.textContent = 'Max file size: 10MB. Supported formats: jpg, png, pdf';
        }
    });

    // Live Chat Widget
    const chatWidget = document.getElementById('chat-widget');
    const startChatBtns = document.querySelectorAll('.start-chat');
    const closeChatBtn = document.querySelector('.close-chat');
    const chatInput = chatWidget.querySelector('input');
    const chatMessages = document.querySelector('.chat-messages');
    const sendBtn = chatWidget.querySelector('.chat-input button');

    startChatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chatWidget.classList.add('active');
            chatInput.focus();
        });
    });

    closeChatBtn.addEventListener('click', () => {
        chatWidget.classList.remove('active');
    });

    // Handle chat message sending
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Simulate agent response
        setTimeout(() => {
            addMessage('Thank you for your message. An agent will be with you shortly.', 'agent');
        }, 1000);
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Phone Call Handling
    const callButtons = document.querySelectorAll('.contact-card button:not(.start-chat)');
    callButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            if (action === 'Call Now') {
                window.location.href = 'tel:1-800-759-2665';
            } else if (action === 'Send Email') {
                window.location.href = 'mailto:support@skybooker.com';
            }
        });
    });

    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
            <button class="close-notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 1rem;
                right: 1rem;
                padding: 1rem;
                border-radius: 4px;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            }
            .notification.success {
                border-left: 4px solid #28a745;
            }
            .notification.error {
                border-left: 4px solid #dc3545;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification i {
                font-size: 1.2rem;
            }
            .notification.success i {
                color: #28a745;
            }
            .notification.error i {
                color: #dc3545;
            }
            .close-notification {
                background: none;
                border: none;
                cursor: pointer;
                color: #666;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Add to document
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button handler
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Form Validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.classList.add('error');
            
            // Remove error class on input
            this.addEventListener('input', function() {
                this.classList.remove('error');
            }, { once: true });
        });
    });
});
