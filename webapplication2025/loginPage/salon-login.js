class SalonLogin extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = /*html*/`
            <style>
                .auth-container { max-width: 450px; margin: 50px auto; padding: 40px; background: white; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
                .logo { text-align: center; margin-bottom: 30px; }
                .logo h1 { color: #667eea; font-size: 32px; }
                .tabs { display: flex; border-bottom: 2px solid #f0f0f0; margin-bottom: 30px; }
                .tab { flex: 1; text-align: center; padding: 15px; cursor: pointer; color: #999; font-weight: 600; border-bottom: 3px solid transparent; }
                .tab.active { color: #667eea; border-bottom-color: #667eea; }
                .form-content { display: none; }
                .form-content.active { display: block; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; margin-bottom: 8px; color: #555; font-weight: 500; }
                .form-group input { width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 15px; box-sizing: border-box; }
                .form-group input:focus { outline: none; border-color: #667eea; }
                .btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: 600; }
                .btn:hover { opacity: 0.9; }
                .message { margin-top: 15px; padding: 12px; border-radius: 8px; text-align: center; display: none; }
                .message.show { display: block; }
                .message.error { background: #fee; color: #c33; }
                .message.success { background: #efe; color: #3c3; }
            </style>

            <div class="auth-container">
                <div class="logo">
                    <h1>💅 Beauty Salon</h1>
                    <p>Гоо сайхны цаг захиалгын систем</p>
                </div>
                <div class="tabs">
                    <div class="tab active" data-tab="login">Нэвтрэх</div>
                    <div class="tab" data-tab="register">Бүртгүүлэх</div>
                </div>
                <div id="login-form" class="form-content active">
                    <form id="loginForm">
                        <div class="form-group">
                            <label>И-мэйл хаяг</label>
                            <input type="email" id="login-email" placeholder="example@email.com" required>
                        </div>
                        <div class="form-group">
                            <label>Нууц үг</label>
                            <input type="password" id="login-password" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="btn">Нэвтрэх</button>
                        <div id="login-message" class="message"></div>
                    </form>
                </div>
                <div id="register-form" class="form-content">
                    <form id="registerForm">
                        <div class="form-group">
                            <label>Нэр</label>
                            <input type="text" id="register-name" placeholder="Таны нэр" required>
                        </div>
                        <div class="form-group">
                            <label>И-мэйл хаяг</label>
                            <input type="email" id="register-email" placeholder="example@email.com" required>
                        </div>
                        <div class="form-group">
                            <label>Утасны дугаар</label>
                            <input type="tel" id="register-phone" placeholder="99119911">
                        </div>
                        <div class="form-group">
                            <label>Нууц үг</label>
                            <input type="password" id="register-password" placeholder="6-аас дээш тэмдэгт" required>
                        </div>
                        <div class="form-group">
                            <label>Нууц үг давтах</label>
                            <input type="password" id="register-confirm" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="btn">Бүртгүүлэх</button>
                        <div id="register-message" class="message"></div>
                    </form>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const API_URL = 'http://localhost:3000';

        this.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));
                tab.classList.add('active');
                const formId = tab.dataset.tab + '-form';
                this.querySelector(`#${formId}`).classList.add('active');
            });
        });

        // ✅ LOGIN
        this.querySelector('#loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
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
                    message.textContent = '✅ ' + data.message;
                    
                    // ✅ User болон Token хадгалах
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('token', data.token);
                    
                    // ✅ Dispatch event
                    window.dispatchEvent(new Event('user-logged-in'));
                    
                    // ✅ Navigate to profile
                    setTimeout(() => {
                        window.location.hash = '#/profile';
                    }, 1000);
                } else {
                    message.className = 'message error show';
                    message.textContent = '❌ ' + data.error;
                }
            } catch (error) {
                message.className = 'message error show';
                message.textContent = '❌ Серверт холбогдож чадсангүй';
                console.error('Login error:', error);
            }
        });

        // ✅ REGISTER
        this.querySelector('#registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = this.querySelector('#register-name').value;
            const email = this.querySelector('#register-email').value;
            const phone = this.querySelector('#register-phone').value;
            const password = this.querySelector('#register-password').value;
            const confirm = this.querySelector('#register-confirm').value;
            const message = this.querySelector('#register-message');
            
            if (password !== confirm) {
                message.className = 'message error show';
                message.textContent = '❌ Нууц үг таарахгүй байна';
                return;
            }

            if (password.length < 6) {
                message.className = 'message error show';
                message.textContent = '❌ Нууц үг 6-аас дээш тэмдэгт байх ёстой';
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
                    message.textContent = '✅ ' + data.message;
                    
                    // ✅ User болон Token хадгалах
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('token', data.token);
                    
                    // ✅ Dispatch event
                    window.dispatchEvent(new Event('user-logged-in'));
                    
                    // ✅ Navigate to profile
                    setTimeout(() => {
                        window.location.hash = '#/profile';
                    }, 1000);
                } else {
                    message.className = 'message error show';
                    message.textContent = '❌ ' + (data.error || data.errors[0].msg);
                }
            } catch (error) {
                message.className = 'message error show';
                message.textContent = '❌ Серверт холбогдож чадсангүй';
                console.error('Register error:', error);
            }
        });
    }

    disconnectedCallback() {
    }
}

window.customElements.define('salon-login', SalonLogin);