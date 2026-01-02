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
        `;
        
        const closeBtn = this.querySelector('#notifClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }

    show() {
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