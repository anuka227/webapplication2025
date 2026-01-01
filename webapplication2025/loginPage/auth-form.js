// components/auth-form.js

class AuthForm extends HTMLElement {
    constructor() {
        super();
        this.mode = this.getAttribute('mode') || 'standalone'; // 'standalone' or 'modal'
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    render() {
        const isModal = this.mode === 'modal';
        
        this.innerHTML = `
            <div class="auth-container ${isModal ? 'modal-style' : 'page-style'}">
                ${isModal ? '<button class="close-modal-btn" id="closeModalBtn">×</button>' : ''}
                
                <div class="logo">
                    <p>${isModal ? 'Захиалга хийхийн тулд нэвтэрнэ үү' : ''}</p>
                </div>
                
                <div class="tabs">
                    <div class="tab active" data-tab="login">Нэвтрэх</div>
                    <div class="tab" data-tab="register">Бүртгүүлэх</div>
                </div>
                
                <div id="login-form" class="form-content active">
                    <form id="loginForm">
                        <div class="form-group">
                            <label>И-мэйл хаяг</label>
                            <input type="email" id="login-email" placeholder="@gmail.com" required>
                        </div>
                        <div class="form-group">
                            <label>Нууц үг</label>
                            <input type="password" id="login-password"  required>
                        </div>
                        <button type="submit" class="btn">Нэвтрэх</button>
                        <div id="login-message" class="message"></div>
                    </form>
                </div>
                
                <!-- Register Form -->
                <div id="register-form" class="form-content">
                    <form id="registerForm">
                        <div class="form-group">
                            <label>Нэр</label>
                            <input type="text" id="register-name" required>
                        </div>
                        <div class="form-group">
                            <label>И-мэйл хаяг</label>
                            <input type="email" id="register-email" placeholder="@gmail.com" required>
                        </div>
                        <div class="form-group">
                            <label>Утасны дугаар</label>
                            <input type="tel" id="register-phone">
                        </div>
                        <div class="form-group">
                            <label>Нууц үг</label>
                            <input type="password" id="register-password" placeholder="6-аас дээш тэмдэгт оруулна уу." required>
                        </div>
                        <div class="form-group">
                            <label>Нууц үг давтах</label>
                            <input type="password" id="register-confirm" required>
                        </div>
                        <button type="submit" class="btn">Бүртгүүлэх</button>
                        <div id="register-message" class="message"></div>
                    </form>
                </div>
            </div>
            
            <style>
                .auth-container {
                    background: white;
                    border-radius: 15px;
                    position: relative;
                }
                
                .auth-container.page-style {
                    max-width: 450px;
                    margin: 50px auto;
                    padding: 40px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                }
                
                /* Modal style */
                .auth-container.modal-style {
                    padding: 40px;
                }
                
                .close-modal-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(0, 0, 0, 0.05);
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                }
                
                .close-modal-btn:hover {
                    background: rgba(0, 0, 0, 0.1);
                    transform: rotate(90deg);
                    color: #333;
                }
                
                .logo {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .logo p {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                }
                
                .tabs {
                    display: flex;
                    border-bottom: 2px solid #f0f0f0;
                    margin-bottom: 30px;
                }
                
                .tab {
                    flex: 1;
                    text-align: center;
                    padding: 15px;
                    cursor: pointer;
                    color: #999;
                    font-weight: 600;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s;
                }
                
                .tab.active {
                    color: #667eea;
                    border-bottom-color: #667eea;
                }
                
                .form-content {
                    display: none;
                }
                
                .form-content.active {
                    display: block;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #555;
                    font-weight: 500;
                }
                
                .form-group input {
                    width: 100%;
                    padding: 14px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 15px;
                    box-sizing: border-box;
                    transition: border-color 0.3s;
                }
                
                .form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                
                .btn {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                }
                
                .btn:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }
                
                .message {
                    margin-top: 15px;
                    padding: 12px;
                    border-radius: 8px;
                    text-align: center;
                    display: none;
                }
                
                .message.show {
                    display: block;
                }
                
                .message.error {
                    background: #fee;
                    color: #c33;
                }
                
                .message.success {
                    background: #efe;
                    color: #3c3;
                }
                
                /* Mobile */
                @media (max-width: 768px) {
                    .auth-container.page-style {
                        margin: 20px;
                        padding: 30px 20px;
                    }
                    
                    .auth-container.modal-style {
                        padding: 30px 20px;
                    }
                    
                    .logo h1 {
                        font-size: 28px;
                    }
                    
                    .tab {
                        padding: 12px;
                        font-size: 14px;
                    }
                }
            </style>
        `;
    }

    attachEvents() {
        const API_URL = 'http://localhost:3000';
        
        const closeBtn = this.querySelector('#closeModalBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('close-modal', {
                    bubbles: true,
                    composed: true
                }));
            });
        }
        
        this.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));
                tab.classList.add('active');
                const formId = tab.dataset.tab + '-form';
                this.querySelector(`#${formId}`).classList.add('active');
            });
        });

        this.querySelector('#loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(API_URL);
        });

        this.querySelector('#registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister(API_URL);
        });
    }

    async handleLogin(API_URL) {
        const email = this.querySelector('#login-email').value;
        const password = this.querySelector('#login-password').value;
        const message = this.querySelector('#login-message');
        
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                message.className = 'message success show';
                message.textContent = data.message;
                
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                
                window.dispatchEvent(new Event('user-logged-in'));
                this.dispatchEvent(new CustomEvent('auth-success', {
                    detail: { user: data.user },
                    bubbles: true,
                    composed: true
                }));
                
                // Navigate based on mode
                if (this.mode === 'standalone') {
                    setTimeout(() => {
                        window.location.hash = '#/profile';
                    }, 1000);
                }
            } else {
                message.className = 'message error show';
                message.textContent = data.error;
            }
        } catch (error) {
            message.className = 'message error show';
            message.textContent = 'Серверт холбогдож чадсангүй';
            console.error('Login error:', error);
        }
    }

    async handleRegister(API_URL) {
        const name = this.querySelector('#register-name').value;
        const email = this.querySelector('#register-email').value;
        const phone = this.querySelector('#register-phone').value;
        const password = this.querySelector('#register-password').value;
        const confirm = this.querySelector('#register-confirm').value;
        const message = this.querySelector('#register-message');
        
        if (password !== confirm) {
            message.className = 'message error show';
            message.textContent = 'Нууц үг таарахгүй байна';
            return;
        }

        if (password.length < 6) {
            message.className = 'message error show';
            message.textContent = 'Нууц үг 6-аас дээш тэмдэгт байх ёстой';
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, email, password, phone })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                message.className = 'message success show';
                message.textContent = data.message;
                
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                
                window.dispatchEvent(new Event('user-logged-in'));
                
                this.dispatchEvent(new CustomEvent('auth-success', {
                    detail: { user: data.user },
                    bubbles: true,
                    composed: true
                }));
                
                if (this.mode === 'standalone') {
                    setTimeout(() => {
                        window.location.hash = '#/profile';
                    }, 1000);
                }
            } else {
                message.className = 'message error show';
                message.textContent = (data.error || data.errors[0].msg);
            }
        } catch (error) {
            message.className = 'message error show';
            message.textContent = 'Серверт холбогдож чадсангүй';
            console.error('Register error:', error);
        }
    }
}

customElements.define('auth-form', AuthForm);