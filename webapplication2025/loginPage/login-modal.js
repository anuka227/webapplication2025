// components/login-modal.js

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
            </dialog>
            
            <style>
                .login-modal-dialog {
                    border: none;
                    border-radius: 15px;
                    padding: 0;
                    max-width: 450px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                
                .login-modal-dialog::backdrop {
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                }
                
                /* Mobile */
                @media (max-width: 768px) {
                    .login-modal-dialog {
                        max-width: 100%;
                        width: 100%;
                        margin: 0;
                        border-radius: 24px 24px 0 0;
                        position: fixed;
                        bottom: 0;
                    }
                }
            </style>
        `;
    }

    attachEvents() {
        const dialog = this.querySelector('#loginModalDialog');
        const authForm = this.querySelector('auth-form');
        
        // Click backdrop to close
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.close();
            }
        });
        
        // Close button event
        authForm.addEventListener('close-modal', () => {
            this.close();
        });
        
        // Auth success event
        authForm.addEventListener('auth-success', () => {
            this.close();
            
            setTimeout(() => {
                if (window.BookingManager) {
                    window.BookingManager.showNotification('✅ Амжилттай нэвтэрлээ!', 'success');
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