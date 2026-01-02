class LoginModal extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
        this.show();
    }

    render() {
        this.innerHTML = `
            <dialog class="login-modal-dialog" id="loginModalDialog">
                <auth-form mode="modal"></auth-form>
            </dialog>`;
    }

    attachEvents() {
        const dialog = this.querySelector('#loginModalDialog');
        const authForm = this.querySelector('auth-form');
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.close();
            }
        });
        
        authForm.addEventListener('close-modal', () => {
            this.close();
        });
        
        authForm.addEventListener('auth-success', () => {
            this.close();
            
            setTimeout(() => {
                if (window.BookingManager) {
                    window.BookingManager.showNotification('Амжилттай нэвтэрлээ!', 'success');
                }
            }, 300);
        });
    }

    show() {
        const dialog = this.querySelector('#loginModalDialog');
        setTimeout(() => dialog.showModal(), 100);
    }

    close() {
        const dialog = this.querySelector('#loginModalDialog');
        dialog.close();
        setTimeout(() => this.remove(), 300);
    }
}

customElements.define('login-modal', LoginModal);