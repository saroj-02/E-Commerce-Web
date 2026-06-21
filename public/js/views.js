const mainContent = document.getElementById('app');

async function renderHome() {
    mainContent.innerHTML = `
        <section class="hero">
            <h1 class="reveal">Define Your <br><span style="color: var(--primary)">Excellence.</span></h1>
            <p class="reveal" style="animation-delay: 0.2s">Experience the pinnacle of luxury and technology. Hand-selected products for the contemporary visionary.</p>
            <div class="hero-btns reveal" style="animation-delay: 0.4s">
                <a href="/shop" class="btn btn-primary">Shop Collection</a>
                <a href="/auth" class="btn btn-outline">Join Exclusive</a>
            </div>
        </section>

        <div class="container" id="featured">
            <h2 class="section-title">Featured Creations</h2>
            <div class="product-grid" id="product-list">
                <!-- Products injected here -->
            </div>
        </div>
    `;
    loadProducts();
}

async function renderShop() {
    mainContent.innerHTML = `
        <div class="container" style="padding-top: 50px;">
            <h1 class="playfair" style="font-size: 3rem; margin-bottom: 2rem;">The Collection</h1>
            <div class="product-grid" id="all-products">
                <!-- Items injected here -->
            </div>
        </div>
    `;
    loadAllProducts();
}

async function renderCart() {
    mainContent.innerHTML = `
        <div class="container" style="padding-top: 50px;">
            <h1 class="playfair" style="font-size: 3rem; margin-bottom: 2rem;">Shopping Cart</h1>
            <div id="cart-content" class="cart-layout">
                <div id="cart-items"></div>
                <div class="summary-card glass">
                    <h3 style="margin-bottom: 2rem;">Order Summary</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <span>Subtotal</span>
                        <span id="subtotal">$0.00</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <span>Shipping</span>
                        <span>Calculated at next step</span>
                    </div>
                    <hr style="border: 0; border-top: 1px solid var(--glass-border); margin: 2rem 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 2rem; font-weight: 800; font-size: 1.2rem;">
                        <span>Total</span>
                        <span id="total">$0.00</span>
                    </div>
                    <button onclick="checkout()" class="btn btn-primary" style="width: 100%;">Checkout Now</button>
                </div>
            </div>
        </div>
    `;
    loadCart();
}

async function renderAccount() {
    mainContent.innerHTML = `
        <div class="container profile-container" style="margin-top: 50px;">
            <aside class="profile-sidebar glass reveal">
                <div class="avatar" id="user-avatar">
                    <i class="fa-solid fa-user"></i>
                </div>
                <h2 id="sidebar-name">Loading...</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Elite Member</p>
                <button onclick="window.store.logout()" class="btn btn-outline" style="width: 100%;">Logout</button>
            </aside>

            <main class="profile-main glass reveal" style="animation-delay: 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem;">
                    <h1 class="playfair" style="margin: 0;">Account Details</h1>
                    <button onclick="openEditProfile()" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.9rem;"><i class="fa-solid fa-pen-to-square"></i> Edit Profile</button>
                </div>
                
                <div class="info-group">
                    <div class="info-label">FULL NAME</div>
                    <div class="info-value" id="profile-name">---</div>
                </div>
                
                <div class="info-group">
                    <div class="info-label">EMAIL ADDRESS</div>
                    <div class="info-value" id="profile-email">---</div>
                </div>

                <div class="info-group">
                    <div class="info-label">PHONE NUMBER</div>
                    <div class="info-value" id="profile-phone">Not provided</div>
                </div>

                <div class="info-group">
                    <div class="info-label">MEMBER SINCE</div>
                    <div class="info-value" id="profile-date">---</div>
                </div>


                <h2 class="playfair" style="margin: 3rem 0 1.5rem;">Order History</h2>
                <div id="order-history" class="order-list"></div>

                <h2 class="playfair" style="margin: 3rem 0 1.5rem;">My Wishlist</h2>
                <div id="wishlist-container" class="wishlist-grid"></div>
            </main>
        </div>
    `;
    initAccount();
}

async function renderAuth() {
    mainContent.innerHTML = `
        <div class="auth-container">
            <div class="auth-card glass reveal">
                <h2 id="auth-title" style="margin-bottom: 2rem; font-size: 2rem;">Sign In</h2>
                <form id="auth-form">
                    <div class="form-group" id="name-group" style="display: none;">
                        <label for="reg-name">Full Name</label>
                        <input type="text" id="reg-name" placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label for="auth-email">Email Address</label>
                        <input type="email" id="auth-email" required placeholder="name@aura.com">
                    </div>
                    <div class="form-group">
                        <label for="auth-pass">Password</label>
                        <input type="password" id="auth-pass" required placeholder="••••••••">
                    </div>

                    <div class="form-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
                        <input type="checkbox" id="is-admin-toggle" style="width: auto;">
                        <label for="is-admin-toggle" style="margin-bottom: 0; cursor: pointer;">Login/Register as Admin</label>
                    </div>

                    <div class="form-group" id="admin-key-group" style="display: none;">
                        <label for="admin-key">Admin Secret Key</label>
                        <input type="password" id="admin-key" placeholder="Enter Admin Key">
                    </div>

                    <button type="submit" class="btn btn-primary" id="submit-btn" style="width: 100%; margin-top: 1rem;">Sign In</button>
                </form>
                <p style="margin-top: 2rem; text-align: center; color: var(--text-muted)">
                    <span id="toggle-text">Don't have an account?</span> 
                    <button onclick="toggleAuthMode()" id="toggle-btn" style="background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; margin-left: 0.5rem;">Sign Up</button>
                </p>
            </div>
        </div>
    `;
    initAuth();
}

async function renderAdmin() {
    if (!window.store.user?.isAdmin) {
        navigate('/auth');
        return;
    }
    mainContent.innerHTML = `
        <div class="container" style="padding-top: 50px;">
            <h1 class="playfair" style="font-size: 3rem; margin-bottom: 2rem;">Admin Dashboard</h1>
            
            <div class="admin-grid">
                <div class="admin-form-card glass">
                    <h2 id="form-title" style="margin-bottom: 2rem; color: var(--primary)">Add New Product</h2>
                    <form id="add-product-form">
                        <input type="hidden" id="editing-id">
                        <div class="form-group">
                            <label for="name">Product Name</label>
                            <input type="text" id="name" required placeholder="Luxury Watch">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="price">Price ($)</label>
                                <input type="number" step="0.01" id="price" required placeholder="999.99">
                            </div>
                            <div class="form-group">
                                <label for="stock">Stock</label>
                                <input type="number" id="stock" required placeholder="10">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="category">Category</label>
                            <select id="category" class="glass" style="width: 100%; padding: 1rem; border-radius: 10px; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); color: white; outline: none;">
                                <option value="Electronics">Electronics</option>
                                <option value="Audio">Audio</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Home">Home</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Wellness">Wellness</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <div style="font-size:0.95rem; color: var(--text-muted); margin-bottom:0.6rem;">Product Imagery</div>
                            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                                <button type="button" onclick="toggleImageSource('url')" id="btn-url" class="btn btn-outline" style="flex: 1; padding: 0.5rem;">URL Mode</button>
                                <button type="button" onclick="toggleImageSource('file')" id="btn-file" class="btn btn-outline" style="flex: 1; padding: 0.5rem;">Upload Mode</button>
                            </div>
                            
                            <div id="url-inputs">
                                <label for="image_url" style="font-size: 0.8rem; opacity: 0.8;">Main Image URL</label>
                                <input type="text" id="image_url" placeholder="https://unsplash.com/main-image">
                                <label for="gallery_urls" style="font-size: 0.8rem; opacity: 0.8; margin-top: 1rem; display: block;">Secondary Gallery URLs (Comma separated)</label>
                                <input type="text" id="gallery_urls" placeholder="url1, url2, url3...">
                            </div>

                            <div id="file-inputs" style="display: none;">
                                <label for="image_files" style="font-size: 0.8rem; opacity: 0.8;">Select Images (Main + Secondary, max 6)</label>
                                <input type="file" id="image_files" multiple accept="image/*" class="glass" style="padding: 0.5rem;">
                            </div>
                            
                            <p id="upload-status" style="font-size: 0.8rem; color: var(--primary); margin-top: 0.5rem; display: none;"></p>
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" rows="4" style="width: 100%; padding: 1rem; border-radius: 10px; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border); color: white; outline: none; font-family: inherit;" required placeholder="Describe the masterpiece..."></textarea>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" id="admin-submit-btn" class="btn btn-primary" style="flex: 2;">Create Product</button>
                            <button type="button" id="cancel-btn" onclick="resetAdminForm()" class="btn btn-outline" style="flex: 1; display: none;">Cancel</button>
                        </div>
                    </form>
                </div>

                <div class="product-list-card glass">
                    <h2 style="margin-bottom: 2rem;">Manage Catalog</h2>
                    <div style="overflow-x: auto;">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="admin-product-list"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    initAdmin();
}
