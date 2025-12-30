class ProfileInfo extends HTMLElement {
    constructor() {
        super();
        this.user = null;
    }

    connectedCallback() {
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = /* html */`
            <style>
                .profile-container {
                    display: flex;
                    gap: 20px;
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                #orders {
                    flex: 2;
                }

                #profile {
                    flex: 1;
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                    text-align: center;
                    position: relative;
                }

                #editBtn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: var(--color-pink-default);
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 18px;
                }

                #editBtn:hover {
                    background: #5568d3;
                }

                #profile img {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-bottom: 15px;
                    border: 4px solid #ea66ddff;
                }

                #profile p b {
                    font-size: 24px;
                    color: #333;
                }

                #profile ul {
                    list-style: none;
                    padding: 0;
                    text-align: left;
                    margin-top: 20px;
                }

                #profile ul li {
                    padding: 10px 0;
                    border-bottom: 1px solid #f0f0f0;
                    color: #666;
                }

                .order-header, .history-header {
                    margin-bottom: 20px;
                }

                .order-header h1, .history-header h1 {
                    color: #333;
                    font-size: 28px;
                    margin-bottom: 5px;
                }

                .order-header p {
                    color: #666;
                }

                .order-list {
                    display: grid;
                    gap: 15px;
                    margin-bottom: 30px;
                }

                .order-card {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .order-card:hover {
                    transform: translateY(-2px);
                }

                .order-card h3 {
                    color: var(--color-pink-selected);
                    margin-bottom: 10px;
                }

                .order-card p {
                    color: #666;
                    margin: 5px 0;
                }

                .history-cards {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                    cursor: pointer;
                }

                .history-cards h3 {
                    color: #333;
                    margin-bottom: 10px;
                }

                .rating {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .star {
                    color: #ffc107;
                    font-size: 20px;
                }

                .rating-number {
                    color: #666;
                    font-weight: 600;
                    margin-left: 5px;
                }

                dialog {
                    border: none;
                    border-radius: 15px;
                    padding: 0;
                    max-width: 600px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                }

                dialog::backdrop {
                    background: rgba(0, 0, 0, 0.5);
                }

                .dialog-content {
                    padding: 30px;
                }

                .dialog-content h2 {
                    color: #333;
                    margin-bottom: 20px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group.full {
                    grid-column: 1 / -1;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #666;
                    font-weight: 600;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 14px;
                    box-sizing: border-box;
                }

                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: var(--color-pink-default);
                }

                .phone-group {
                    display: flex;
                    gap: 10px;
                }

                .phone-group select {
                    width: 100px;
                }

                .date-group {
                    display: grid;
                    grid-template-columns: 1fr 2fr 1fr;
                    gap: 10px;
                }

                .save-btn {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 600;
                    margin-top: 20px;
                }

                .save-btn:hover {
                    opacity: 0.9;
                }

                @media (max-width: 768px) {
                    .profile-container {
                        flex-direction: column;
                    }

                    #orders {
                        order: 1;
                    }

                    #profile {
                        order: 2;
                    }
                }
            </style>

            <div class="profile-container">
                <section id="orders">
                    <div class="order-header">
                        <h1>Захиалга</h1>
                        <p>Баталгаажуулсан</p>
                    </div>			
                    <div class="order-list">
                        <div class="order-card">
                            <h3>Beauty salon</h3>
                            <p><strong>Үйлчилгээ:</strong> Үс засалт</p>
                            <p><strong>Байршил:</strong> Улаанбаатар</p>
                            <p><strong>Цаг:</strong> 14:00</p>
                        </div>

                        <div class="order-card">
                            <h3>Beauty salon</h3>
                            <p><strong>Үйлчилгээ:</strong> Маникюр</p>
                            <p><strong>Байршил:</strong> Улаанбаатар</p>
                            <p><strong>Цаг:</strong> 15:00</p>
                        </div>

                        <div class="order-card">
                            <h3>Beauty salon</h3>
                            <p><strong>Үйлчилгээ:</strong> Массаж</p>
                            <p><strong>Байршил:</strong> Улаанбаатар</p>
                            <p><strong>Цаг:</strong> 16:00</p>
                        </div>
                    </div>
                    
                    <div class="history-header">
                        <h1>Захиалгын түүх</h1>
                    </div>
                    <div class="history-cards">
                        <h3>Halo salon</h3>
                        <div class="rating">
                            <span class="star">★</span>
                            <span class="star">★</span>
                            <span class="star">★</span>                        
                            <span class="star">★</span>
                            <span class="star">★</span>
                            <span class="rating-number">4.5</span>
                        </div>
                    </div>
                </section>

                <section id="profile">
                    <button id="editBtn">✏️</button>
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" alt="Profile">
                    <p><b>${this.user.name || 'Хэрэглэгч'}</b></p>
                    <ul>
                        <li>Нэр: ${this.user.name || '-'}</li>
                        <li>Утас: ${this.user.phone || '-'}</li>
                        <li>Email: ${this.user.email || '-'}</li>
                    </ul>
                </section>
            </div>

            <dialog id="editDialog">
                <div class="dialog-content">
                    <h2>Профайл засах</h2>
                    <form id="editForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">Нэр</label>
                                <input type="text" id="firstName" value="${this.user.name || ''}">
                            </div>
                        </div>

                        <div class="form-group full">
                            <label for="mobile">Утасны дугаар</label>
                            <div class="phone-group">
                                <select id="countryCode">
                                    <option value="+976" selected>+976</option>
                                    <option value="+1">+1</option>
                                    <option value="+86">+86</option>
                                    <option value="+82">+82</option>
                                </select>
                                <input type="tel" id="mobile" value="${this.user.phone || ''}">
                            </div>
                        </div>

                        <div class="form-group full">
                            <label for="email">Email</label>
                            <input type="email" id="email" value="${this.user.email || ''}" readonly>
                        </div>

                        <button type="submit" class="save-btn">Хадгалах</button>
                    </form>
                </div>
            </dialog>
        `;
    }

    attachEventListeners() {
        const editDialog = this.querySelector('#editDialog');
        const editForm = this.querySelector('#editForm');
        const editBtn = this.querySelector('#editBtn');

        editBtn.addEventListener('click', () => {
            editDialog.showModal();
        });

        editDialog.addEventListener('click', (e) => {
            if (e.target === editDialog) {
                editDialog.close();
            }
        });

        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = this.querySelector('#firstName').value;
            const phone = this.querySelector('#mobile').value;
            const token = localStorage.getItem('token');  
            
            try {
                const response = await fetch('http://localhost:3000/api/auth/update', {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`  
                    },
                    credentials: 'include',
                    body: JSON.stringify({ name, phone })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    alert('✅ Өөрчлөлт хадгалагдлаа!');
                    editDialog.close();
                    this.user = data.user;
                    this.render();
                    this.attachEventListeners();
                } else {
                    alert('❌ Алдаа: ' + data.error);
                }
            } catch (error) {
                alert('❌ Серверт холбогдож чадсангүй');
                console.error('Update error:', error);
            }
        });
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldVal, newVal) {
    }

    adoptedCallback() {
    }
}

window.customElements.define('profile-info', ProfileInfo);