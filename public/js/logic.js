// Global Logic for SPA
// Home Logic
async function loadProducts() {
    await window.store.fetchCart();
    const products = await window.api.get('/products');
    window.allProducts = products;
    const grid = document.getElementById('product-list');
    if (!grid || !Array.isArray(products)) return;
    grid.innerHTML = products.map((p, i) => {
        const isLiked = window.store.user?.wishlist?.some(id => id.toString() === p._id.toString());
        const inCart = window.store.cart?.some(item => item.product_id === p._id);
        return `
        <div class="product-card glass reveal" style="animation-delay: ${0.2 * i}s" onclick="openProduct('${p._id}')">
            <button onclick="toggleLike(event, '${p._id}')" class="like-btn ${isLiked ? 'liked' : ''}" id="like-${p._id}">
                <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart"></i>
            </button>
            <img src="${p.image_url}" class="product-image" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">${p.category}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="product-price">$${p.price.toLocaleString()}</span>
                    <button onclick="handleAddToCart(this, event, '${p._id}')" class="btn ${inCart ? 'added' : 'btn-outline'}" style="padding: 0.5rem 1.5rem;">
                        ${inCart ? '<i class="fa-solid fa-check"></i> Added' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// Shop Logic
async function loadAllProducts() {
    await window.store.fetchCart();
    const products = await window.api.get('/products');
    window.allProducts = products;
    const grid = document.getElementById('all-products');
    if (!grid || !Array.isArray(products)) return;
    grid.innerHTML = products.map((p, i) => {
        const isLiked = window.store.user?.wishlist?.some(id => id.toString() === p._id.toString());
        const inCart = window.store.cart?.some(item => item.product_id === p._id);
        return `
        <div class="product-card glass reveal" style="animation-delay: ${0.1 * i}s" onclick="openProduct('${p._id}')">
            <button onclick="toggleLike(event, '${p._id}')" class="like-btn ${isLiked ? 'liked' : ''}" id="like-${p._id}">
                <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart"></i>
            </button>
            <img src="${p.image_url}" class="product-image" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'">
            <div class="product-info">
                <h3>${p.name}</h3>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">${p.category}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="product-price">$${p.price.toLocaleString()}</span>
                    <button onclick="handleAddToCart(this, event, '${p._id}')" class="btn ${inCart ? 'added' : 'btn-primary'}" style="padding: 0.5rem 1.5rem;">
                        ${inCart ? '<i class="fa-solid fa-check"></i> Added' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// Cart Logic
async function loadCart() {
    if (!window.store.user) {
        document.getElementById('cart-content').innerHTML = `
            <div style="text-align: center; grid-column: 1 / -1; padding: 5rem;">
                <h2 style="margin-bottom: 1rem;">Your cart is lonely.</h2>
                <a href="/auth" class="btn btn-primary">Login to view cart</a>
            </div>
        `;
        return;
    }
    
    await window.store.fetchCart();
    renderCartUI();
}

function renderCartUI() {
    const items = window.store.cart;
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = `<p style="padding: 2rem;">No items in cart yet.</p>`;
        updateTotals(0);
        return;
    }

    container.innerHTML = items.map(p => `
        <div class="cart-item glass reveal">
            <img src="${p.image_url}" alt="${p.name}">
            <div class="cart-details">
                <h3>${p.name}</h3>
                <p style="color: var(--primary); font-weight: 700;">$${p.price.toLocaleString()}</p>
            </div>
            <div class="quantity-controls" style="display: flex; align-items: center; gap: 1rem;">
                <button onclick="window.store.updateQuantity('${p.id}', ${p.quantity - 1})" class="btn-qty"><i class="fa-solid fa-minus"></i></button>
                <span style="font-weight: 700; min-width: 20px; text-align: center;">${p.quantity}</span>
                <button onclick="window.store.updateQuantity('${p.id}', ${p.quantity + 1})" class="btn-qty"><i class="fa-solid fa-plus"></i></button>
                <button onclick="window.store.removeFromCart('${p.id}')" style="margin-left: 2rem; background: none; border: none; color: #ff4757; cursor: pointer; font-size: 1.2rem;"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    `).join('');

    const total = items.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    updateTotals(total);
}

function updateTotals(total) {
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.innerText = `$${total.toLocaleString()}`;
    if (totalEl) totalEl.innerText = `$${total.toLocaleString()}`;
}

async function checkout() {
    const total = window.store.cart.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    if (total === 0) return alert('Cart is empty');
    const res = await window.api.post('/user/orders', { totalAmount: total });
    if (res.orderId) {
        alert(`Order processing... ID: #${res.orderId}`);
        navigate('/');
    }
}

// Account Logic
async function initAccount() {
    renderProfile();
    await window.store.fetchProfile();
    await loadOrders();
    await loadWishlist();
}

async function loadOrders() {
    const orders = await window.store.fetchOrders();
    const orderContainer = document.getElementById('order-history');
    if (!orderContainer) return;
    if (orders.length === 0) {
        orderContainer.innerHTML = '<p style="color: var(--text-muted)">No orders placed yet.</p>';
    } else {
        orderContainer.innerHTML = orders.map(o => `
            <div class="order-item glass" style="flex-direction: column; align-items: stretch; gap: 1rem;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem;">
                    <div>
                        <div style="font-weight: 600; color: var(--primary)">Order #${o._id.slice(-6)}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted)">${new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style="text-align: right">
                        <div style="font-weight: 800">$${o.totalAmount.toLocaleString()}</div>
                        <div style="font-size: 0.8rem; color: var(--primary); text-transform: uppercase">${o.status}</div>
                    </div>
                </div>
                <div class="order-products" style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${o.items.map(item => `
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                            <span>${item.product ? item.product.name : 'Unknown Product'} x ${item.quantity}</span>
                            <span style="color: var(--text-muted)">$${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
}

async function loadWishlist() {
    const wishlist = await window.store.fetchWishlist();
    // Filter out nulls in case some products were deleted from DB
    window.wishlistData = (wishlist || []).filter(p => p !== null);
    renderWishlistUI();
}

function renderWishlistUI() {
    const wishlistContainer = document.getElementById('wishlist-container');
    if (!wishlistContainer) return;
    if (!window.wishlistData || window.wishlistData.length === 0) {
        wishlistContainer.innerHTML = '<p style="color: var(--text-muted)">No liked products.</p>';
    } else {
        wishlistContainer.innerHTML = window.wishlistData.map(p => {
            const inCart = window.store.cart?.some(item => item.product_id === p._id);
            return `
                <div class="product-card glass reveal" style="padding: 1rem; cursor: pointer;" onclick="openProduct('${p._id}')">
                    <img src="${p.image_url}" style="height: 150px; width: 100%; object-fit: cover; border-radius: 10px;" onerror="this.src='https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80'">
                    <h4 style="margin: 0.5rem 0">${p.name}</h4>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--primary); font-weight: 700">$${p.price.toLocaleString()}</span>
                        <button onclick="handleAddToCart(this, event, '${p._id}')" class="btn ${inCart ? 'added' : 'btn-outline'}" style="padding: 0.3rem 0.6rem; font-size: 0.8rem">
                            ${inCart ? '<i class="fa-solid fa-check"></i> Added' : 'Add'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function renderProfile() {
    const user = window.store.user;
    if (!user) {
        if (typeof navigate === 'function') navigate('/auth');
        return;
    }
    const elements = {
        sidebar: document.getElementById('sidebar-name'),
        name: document.getElementById('profile-name'),
        email: document.getElementById('profile-email'),
        date: document.getElementById('profile-date'),
        avatar: document.getElementById('user-avatar')
    };

    if (elements.sidebar) elements.sidebar.innerText = user.name;
    if (elements.name) elements.name.innerText = user.name;
    if (elements.email) elements.email.innerText = user.email;
    const phoneEl = document.getElementById('profile-phone');
    if (phoneEl) phoneEl.innerText = user.phone || 'Not provided';
    
    if (elements.date && user.createdAt) {
        elements.date.innerText = new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    if (elements.avatar) {
        elements.avatar.innerHTML = user.name.charAt(0).toUpperCase();
    }
}

function openEditProfile() {
    const user = window.store.user;
    if (!user) return;
    document.getElementById('edit-name').value = user.name;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-phone').value = user.phone || '';
    
    const modal = document.getElementById('profile-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const form = document.getElementById('edit-profile-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value
        };

        const res = await window.api.put('/user/profile', data);
        if (res.user) {
            window.store.setUser(res.user);
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            alert('Profile updated successfully!');
            renderProfile();
        } else {
            alert(res.message || 'Update failed');
        }
    };
}


// Auth Logic
let isLogin = true;
let isAdminMode = false;

function initAuth() {
    const form = document.getElementById('auth-form');
    if (!form) return;
    
    const isAdminToggle = document.getElementById('is-admin-toggle');
    if (isAdminToggle) {
        isAdminToggle.addEventListener('change', () => {
            document.getElementById('admin-key-group').style.display = isAdminToggle.checked ? 'block' : 'none';
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-pass').value;
        const name = document.getElementById('reg-name').value;
        const adminKey = document.getElementById('admin-key').value;
        const asAdmin = document.getElementById('is-admin-toggle').checked;

        let res;
        const data = { email, password };
        if (asAdmin) data.adminKey = adminKey;
        
        if (isLogin) {
            res = await window.api.post('/auth/login', data);
        } else {
            data.name = name;
            res = await window.api.post('/auth/register', data);
        }

        if (res.token) {
            window.store.setUser(res.user, res.token);
            navigate(res.user.isAdmin ? '/admin' : '/');
        } else if (res.id && !isLogin) {
            alert('Registration successful! Please login.');
            toggleAuthMode();
        } else {
            alert(res.message || 'Authentication failed');
        }
    });
}

function toggleAuthMode() {
    isLogin = !isLogin;
    const authTitle = document.getElementById('auth-title');
    const submitBtn = document.getElementById('submit-btn');
    const toggleText = document.getElementById('toggle-text');
    const toggleBtn = document.getElementById('toggle-btn');
    const nameGroup = document.getElementById('name-group');

    if (authTitle) authTitle.innerText = isLogin ? 'Sign In' : 'Create Account';
    if (submitBtn) submitBtn.innerText = isLogin ? 'Sign In' : 'Sign Up';
    if (toggleText) toggleText.innerText = isLogin ? "Don't have an account?" : "Already have an account?";
    if (toggleBtn) toggleBtn.innerText = isLogin ? 'Sign Up' : 'Sign In';
    if (nameGroup) nameGroup.style.display = isLogin ? 'none' : 'block';
}

// Global Product Modal Logic
function openProduct(id) {
    const p = window.allProducts?.find(x => x._id === id) || window.wishlistData?.find(x => x._id === id);
    if (!p) return;
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    document.getElementById('modal-img').src = p.image_url;
    document.getElementById('modal-title').innerText = p.name;
    document.getElementById('modal-category').innerText = p.category;
    document.getElementById('modal-desc').innerText = p.description;
    document.getElementById('modal-price').innerText = `$${p.price.toLocaleString()}`;
    
    const thumbContainer = document.getElementById('modal-thumbnails');
    const images = p.images && p.images.length > 0 ? p.images : [p.image_url];
    thumbContainer.innerHTML = images.map((img, i) => `
        <img src="${img}" class="thumbnail ${i === 0 ? 'active' : ''}" onclick="switchModalImage(this, '${img}')">
    `).join('');

    const ratingHtml = Array(5).fill(0).map((_, i) => 
        `<i class="fa-${i < Math.floor(p.ratings ?? 4.5) ? 'solid' : 'regular'} fa-star"></i>`
    ).join('') + `<span style="margin-left: 0.5rem; color: var(--text-muted)">(${p.reviewsCount ?? 128} Reviews)</span>`;
    document.getElementById('modal-rating').innerHTML = ratingHtml;

    const features = p.features || ['Premium Build Quality', 'Sustainable Materials', 'Exclusive Design', '2-Year Warranty'];
    document.getElementById('modal-features').innerHTML = features.map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('');

    const addBtn = document.getElementById('modal-add-btn');
    const inCart = window.store.cart?.some(item => item.product_id === p._id);
    if (inCart) {
        addBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
        addBtn.className = 'btn added';
        addBtn.disabled = true;
    } else {
        addBtn.innerHTML = 'Add to Collection';
        addBtn.className = 'btn btn-primary';
        addBtn.disabled = false;
        addBtn.onclick = (e) => handleAddToCart(addBtn, e, p._id);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function toggleLike(e, id) {
    if (e) e.stopPropagation();
    const liked = await window.store.toggleWishlist(id);
    const btn = document.getElementById(`like-${id}`);
    if (btn) {
        btn.classList.toggle('liked', liked);
        btn.innerHTML = `<i class="fa-${liked ? 'solid' : 'regular'} fa-heart"></i>`;
    }
}

function switchModalImage(el, src) {
    document.getElementById('modal-img').src = src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
}

// Helper for Add to Cart Feedback
async function handleAddToCart(btn, e, id) {
    if (e) e.stopPropagation();
    if (!btn) return;

    const success = await window.store.addToCart(id);
    if (success) {
        const originalWidth = btn.offsetWidth;
        btn.style.width = originalWidth + 'px'; // Maintain width
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
        btn.className = 'btn added';
        btn.disabled = true;
        // Notify store to update other buttons if needed
        window.store.notify();
    }
}

// Admin Logic
let adminImageSource = 'url';

function initAdmin() {
    loadAdminProducts();
    const form = document.getElementById('add-product-form');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const editingId = document.getElementById('editing-id').value;
            let finalImageUrl = document.getElementById('image_url').value;
            let finalImages = [];

            if (adminImageSource === 'file') {
                const fileInput = document.getElementById('image_files');
                if (fileInput.files.length > 0) {
                    const status = document.getElementById('upload-status');
                    status.innerText = 'Uploading images...';
                    status.style.display = 'block';
                    
                    const formData = new FormData();
                    for (let i = 0; i < fileInput.files.length; i++) {
                        formData.append('images', fileInput.files[i]);
                    }
                    
                    const uploadRes = await fetch('/api/products/upload', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                        body: formData
                    });
                    const uploadData = await uploadRes.json();
                    if (uploadData.imageUrls?.length > 0) {
                        finalImageUrl = uploadData.imageUrls[0];
                        finalImages = uploadData.imageUrls;
                    } else {
                        alert('Upload failed');
                        return;
                    }
                } else if (!editingId) {
                    alert('Please select files');
                    return;
                }
            } else {
                const secondaryUrls = document.getElementById('gallery_urls').value
                    .split(',').map(u => u.trim()).filter(u => u !== '');
                finalImages = [finalImageUrl, ...secondaryUrls];
            }

            const data = {
                name: document.getElementById('name').value,
                price: parseFloat(document.getElementById('price').value),
                stock: parseInt(document.getElementById('stock').value),
                category: document.getElementById('category').value,
                image_url: finalImageUrl,
                description: document.getElementById('description').value,
                images: finalImages
            };

            const method = editingId ? 'put' : 'post';
            const url = editingId ? `/products/${editingId}` : '/products';
            const res = await window.api[method](url, data);
            if (res._id) {
                alert(editingId ? 'Updated!' : 'Added!');
                resetAdminForm();
                loadAdminProducts();
            }
        };
    }
}

function toggleImageSource(source) {
    adminImageSource = source;
    document.getElementById('url-inputs').style.display = source === 'url' ? 'block' : 'none';
    document.getElementById('file-inputs').style.display = source === 'file' ? 'block' : 'none';
    document.getElementById('btn-url').style.borderColor = source === 'url' ? 'var(--primary)' : 'var(--glass-border)';
    document.getElementById('btn-file').style.borderColor = source === 'file' ? 'var(--primary)' : 'var(--glass-border)';
}

async function loadAdminProducts() {
    const products = await window.api.get('/products');
    window.allProducts = products;
    const tbody = document.getElementById('admin-product-list');
    if (!tbody) return;
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${p.image_url}" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;">
                    <span style="font-weight: 600;">${p.name}</span>
                </div>
            </td>
            <td>${p.category}</td>
            <td style="color: var(--primary); font-weight: 700;">$${p.price.toLocaleString()}</td>
            <td>${p.stock}</td>
            <td>
                <div style="display: flex; gap: 0.8rem;">
                    <button onclick="editProduct('${p._id}')" style="background:none; border:none; color: var(--secondary); cursor:pointer;"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteProduct('${p._id}')" class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editProduct(id) {
    const p = window.allProducts.find(x => x._id === id);
    if (!p) return;
    document.getElementById('editing-id').value = p._id;
    document.getElementById('name').value = p.name;
    document.getElementById('price').value = p.price;
    document.getElementById('stock').value = p.stock;
    document.getElementById('category').value = p.category;
    document.getElementById('image_url').value = p.image_url;
    document.getElementById('gallery_urls').value = p.images ? p.images.filter(img => img !== p.image_url).join(', ') : '';
    document.getElementById('description').value = p.description;
    document.getElementById('form-title').innerText = 'Edit Product';
    document.getElementById('admin-submit-btn').innerText = 'Update Product';
    document.getElementById('cancel-btn').style.display = 'block';
    toggleImageSource('url');
}

function resetAdminForm() {
    document.getElementById('add-product-form').reset();
    document.getElementById('editing-id').value = '';
    document.getElementById('form-title').innerText = 'Add New Product';
    document.getElementById('admin-submit-btn').innerText = 'Create Product';
    document.getElementById('cancel-btn').style.display = 'none';
}

async function deleteProduct(id) {
    if (!confirm('Remove this product?')) return;
    await window.api.delete(`/products/${id}`);
    loadAdminProducts();
}

// Global Modal Close Listeners
document.addEventListener('click', e => {
    const modals = [document.getElementById('product-modal'), document.getElementById('profile-modal')];
    modals.forEach(modal => {
        if (!modal) return;
        if (e.target.classList.contains('close-modal') || e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});


// Global Store Subscription for UI syncing
window.store.subscribe(() => {
    const path = window.location.pathname;
    if (path === '/cart') renderCartUI();
    if (path === '/account' || path === '/account.html') loadWishlist();
    updateAddToCartButtons();
});

function updateAddToCartButtons() {
    const cart = Array.isArray(window.store.cart) ? window.store.cart : [];
    const cartProductIds = cart.map(item => item.product_id);
    document.querySelectorAll('button[onclick*="handleAddToCart"]').forEach(btn => {
        // Extract product ID from onclick attribute: handleAddToCart(this, event, 'ID')
        const match = btn.getAttribute('onclick').match(/'([^']+)'/);
        if (match) {
            const productId = match[1];
            const inCart = cartProductIds.includes(productId);
            if (inCart) {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
                btn.className = 'btn added';
                btn.disabled = true;
            } else {
                const isOutline = btn.closest('.product-info')?.parentElement?.parentElement?.id === 'product-list' || 
                                 btn.closest('#wishlist-container');
                btn.innerHTML = 'Add';
                btn.className = isOutline ? 'btn btn-outline' : 'btn btn-primary';
                btn.disabled = false;
                btn.style.width = '';
            }
        }
    });
}
