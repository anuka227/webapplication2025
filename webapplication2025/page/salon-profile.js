class SalonProfile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.checkAndRender();
        
        window.addEventListener('user-logged-in', () => {
            this.checkAndRender();
        });
        
        window.addEventListener('user-logged-out', () => {
            this.checkAndRender();
        });
    }
    
    checkAndRender() {
        const user = localStorage.getItem('user');
        
        if (!user) {
            this.innerHTML = '<salon-login></salon-login>';
        } else {
            this.renderProfile();
        }
    }

    renderProfile() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        this.innerHTML = /*html*/`
            <style>
                .profile-page {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 30px;
                    align-items: start;
                }

                /* Bookings Section - Left (1fr) */
                .bookings-section {
                    grid-column: 1;
                    min-height: 500px;
                }

                /* Profile Card - Right (340px) */
                .profile-card {
                    grid-column: 2;
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                    text-align: center;
                    position: sticky;
                    top: 20px;
                }

                .profile-image {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin: 0 auto 20px;
                    border: 4px solid #fc88afff;
                    box-shadow: 0 4px 12px rgba(236, 64, 122, 0.3);
                }

                .profile-name {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333;
                    margin-bottom: 8px;
                }
                .profile-info {
                    list-style: none;
                    padding: 0;
                    margin: 20px 0;
                    text-align: left;
                }

                .profile-info li {
                    padding: 12px 0;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                }

                .profile-info li:last-child {
                    border-bottom: none;
                }

                .profile-info .label {
                    color: #999;
                    font-weight: 500;
                }

                .profile-info .value {
                    color: #333;
                    font-weight: 600;
                }

                .edit-profile-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #f594b6 0%, #fc8eac 100%);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 20px;
                }

                .edit-profile-btn:hover {
                    background: linear-gradient(135deg, #f594b6 0%, #fc8eac 100%);
                    transform: translateY(-2px);
                }

                .logout-btn {
                    width: 100%;
                    padding: 14px;
                    background: #fff;
                    color: #fc8eac;
                    border: 2px solid #f594b6;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 12px;
                }

                .logout-btn:hover {
                    background: #fce4ec;
                }

                /* Edit Dialog */
                .edit-dialog {
                    border: none;
                    border-radius: 20px;
                    padding: 0;
                    max-width: 600px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }

                .edit-dialog::backdrop {
                    background: rgba(0, 0, 0, 0.5);
                }

                .dialog-content {
                    padding: 40px;
                }

                .dialog-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .dialog-header h2 {
                    margin: 0;
                    font-size: 24px;
                    color: #333;
                }

                .close-dialog-btn {
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    color: #999;
                    transition: color 0.3s;
                }

                .close-dialog-btn:hover {
                    color: #white;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    color: #666;
                    font-weight: 600;
                    font-size: 14px;
                }

                .form-group input {
                    width: 100%;
                    padding: 14px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 14px;
                    box-sizing: border-box;
                    transition: border-color 0.3s;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #fce4ec;
                }

                .form-group input:disabled {
                    background: #f5f5f5;
                    cursor: not-allowed;
                }

                .phone-group {
                    display: flex;
                    gap: 10px;
                }

                .phone-group select {
                    width: 100px;
                    padding: 14px;
                    border: 2px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 14px;
                    cursor: pointer;
                }

                .save-profile-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #f594b6 0%, #fc8eac 100%);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 10px;
                }

                .save-profile-btn:hover {
                    background: linear-gradient(135deg, #f594b6 0%, #fc8eac 100%);
                    transform: scale(1.02);
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .profile-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    
                    .bookings-section {
                        grid-column: 1;
                        order: 2;
                    }
                    
                    .profile-card {
                        grid-column: 1;
                        position: static;
                        order: 1;
                    }
                }
            </style>

            <div class="profile-page">
                <div class="profile-grid">
                    <!-- Bookings Section (Left - 1fr) -->
                    <div class="bookings-section">
                        <booking-list></booking-list>
                    </div>

                    <!-- Profile Card (Right - 340px) -->
                    <div class="profile-card">
                        <img 
                            src="${user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'}" 
                            alt="Profile" 
                            class="profile-image">
                        
                        <div class="profile-name">${user.name || 'Хэрэглэгч'}</div>
                        <ul class="profile-info">
                            <li>
                                <span class="label">Утас</span>
                                <span class="value">${user.phone || '-'}</span>
                            </li>
                            <li>
                                <span class="label">Email</span>
                                <span class="value">${user.email || '-'}</span>
                            </li>
                        </ul>
                        
                        <button class="edit-profile-btn" id="editProfileBtn">
                             Засах
                        </button>
                        
                        <button class="logout-btn" id="logoutBtn" style="display:none">
                            Гарах
                        </button>
                    </div>
                </div>
            </div>

            <!-- Edit Profile Dialog -->
            <dialog class="edit-dialog" id="editDialog">
                <div class="dialog-content">
                    <div class="dialog-header">
                        <h2>Профайл засах</h2>
                        <button class="close-dialog-btn" id="closeDialogBtn">×</button>
                    </div>
                    
                    <form id="editForm">
                        <div class="form-group">
                            <label for="editName">Нэр</label>
                            <input type="text" id="editName" value="${user.name || ''}" required>
                        </div>

                        <div class="form-group">
                            <label for="editPhone">Утасны дугаар</label>
                            <div class="phone-group">
                                <select id="countryCode">
                                    <option value="+976" selected>+976</option>
                                    <option value="+1">+1</option>
                                    <option value="+86">+86</option>
                                    <option value="+82">+82</option>
                                </select>
                                <input type="tel" id="editPhone" value="${user.phone || ''}" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="editEmail">Email</label>
                            <input type="email" id="editEmail" value="${user.email || ''}" disabled>
                        </div>

                        <button type="submit" class="save-profile-btn">Хадгалах</button>
                    </form>
                </div>
            </dialog>
        `;

        this.attachProfileEvents();
    }

    attachProfileEvents() {
        const editDialog = this.querySelector('#editDialog');
        const editForm = this.querySelector('#editForm');
        const editProfileBtn = this.querySelector('#editProfileBtn');
        const closeDialogBtn = this.querySelector('#closeDialogBtn');
        const logoutBtn = this.querySelector('#logoutBtn');

        // ✅ Edit Profile
        editProfileBtn?.addEventListener('click', () => {
            editDialog.showModal();
        });

        // ✅ Close Dialog
        closeDialogBtn?.addEventListener('click', () => {
            editDialog.close();
        });

        // ✅ Click backdrop to close
        editDialog?.addEventListener('click', (e) => {
            if (e.target === editDialog) {
                editDialog.close();
            }
        });

        // ✅ Save Profile
        editForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = this.querySelector('#editName').value;
            const phone = this.querySelector('#editPhone').value;
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            try {
                const response = await fetch('http://localhost:3000/api/auth/update', {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        name, 
                        phone,
                        userId: user.id  
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    this.showNotification('✅ Өөрчлөлт хадгалагдлаа!', 'success');
                    editDialog.close();
                    this.renderProfile();
                } else {
                    this.showNotification('❌ Алдаа: ' + data.error, 'error');
                }
            } catch (error) {
                this.showNotification('❌ Серверт холбогдож чадсангүй', 'error');
                console.error('Update error:', error);
            }
        });

        // ✅ Logout
        logoutBtn?.addEventListener('click', () => {
            if (confirm('Та системээс гарахдаа итгэлтэй байна уу?')) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                
                window.dispatchEvent(new Event('user-logged-out'));
                
                this.showNotification('👋 Амжилттай гарлаа', 'success');
                
                setTimeout(() => {
                    window.location.hash = '#/';
                }, 500);
            }
        });
    }

    showNotification(message, type = 'success') {
        const existingNotif = document.querySelector('.profile-notification');
        if (existingNotif) {
            existingNotif.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `profile-notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#ff5252'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            font-family: system-ui;
            font-size: 14px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    disconnectedCallback() {}
    attributeChangedCallback(name, oldVal, newVal) {}
    adoptedCallback() {}
}

window.customElements.define('salon-profile', SalonProfile);