class SalonNotification extends HTMLElement {
    static get observedAttributes() {
        return ['message'];
    }

    constructor() {
        super();
        this._message = 'Мэдэгдэл';
    }

    connectedCallback() {
        this.render();
        this.show();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'message' && newValue) {
            this._message = newValue;
            if (this.isConnected) {
                this.render();
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="salon-notification">
                <div class="notification-content">
                    <span class="notification-message">${this._message}</span>
                    <button class="notification-close" id="notifClose">×</button>
                </div>
            </div>
            
            <style>
                .salon-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #ec407a 0%, #f06292 100%);
                    color: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(236, 64, 122, 0.4);
                    z-index: 99999;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 15px;
                    min-width: 300px;
                    max-width: 500px;
                    animation: slideIn 0.3s ease-out;
                    pointer-events: auto;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                
                .notification-message {
                    flex: 1;
                    font-weight: 500;
                }
                
                .notification-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 22px;
                    cursor: pointer;
                    padding: 0;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s;
                    flex-shrink: 0;
                }
                
                .notification-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                }
                
                .salon-notification.closing {
                    animation: slideOut 0.3s ease-out;
                }
                
                /* Mobile */
                @media (max-width: 768px) {
                    .salon-notification {
                        left: 10px;
                        right: 10px;
                        top: 10px;
                        min-width: auto;
                        padding: 14px 20px;
                    }
                    
                    .notification-message {
                        font-size: 14px;
                    }
                    
                    .notification-close {
                        width: 24px;
                        height: 24px;
                        font-size: 20px;
                    }
                }
            </style>
        `;
        
        const closeBtn = this.querySelector('#notifClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }

    show() {
        // 3 секундын дараа автоматаар хаагдана
        setTimeout(() => {
            this.close();
        }, 3000);
    }

    close() {
        const notification = this.querySelector('.salon-notification');
        if (notification) {
            notification.classList.add('closing');
        }
        
        setTimeout(() => {
            this.remove();
        }, 300);
    }
}

customElements.define('salon-notification', SalonNotification);

export function showNotification(message) {
    const existing = document.querySelector('salon-notification');
    if (existing) {
        existing.remove();
    }
    
    const notif = document.createElement('salon-notification');
    notif.setAttribute('message', message);
    document.body.appendChild(notif);
}