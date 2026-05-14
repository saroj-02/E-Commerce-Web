const store = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    cart: [],
    
    setUser(user, token) {
        this.user = user;
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.notify();
    },

    logout() {
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (typeof navigate === 'function') {
            navigate('/');
            this.notify();
        } else {
            window.location.href = '/';
        }
    },

    async fetchCart() {
        if (!this.user) return;
        const res = await window.api.get('/user/cart');
        if (Array.isArray(res)) {
            this.cart = res;
        } else {
            this.cart = [];
            if (res.message === 'Unauthorized') {
                this.logout();
            }
        }
        this.notify();
    },

    async updateQuantity(cartId, quantity) {
        if (quantity < 1) return this.removeFromCart(cartId);
        await window.api.put(`/user/cart/${cartId}`, { quantity });
        await this.fetchCart();
    },

    async removeFromCart(cartId) {
        await window.api.delete(`/user/cart/${cartId}`);
        await this.fetchCart();
    },

    async fetchProfile() {
        if (!this.user) return null;
        const user = await window.api.get('/user/profile');
        if (user && user._id) {
            this.user = { ...this.user, ...user, id: user._id };
            localStorage.setItem('user', JSON.stringify(this.user));
            this.notify();
        }
        return this.user;
    },

    async fetchOrders() {
        if (!this.user) return [];
        return await window.api.get('/user/orders');
    },

    async toggleWishlist(productId) {
        if (!this.user) {
            alert('Please login to like products');
            navigate('/auth');
            return;
        }
        const res = await window.api.post('/user/wishlist/toggle', { productId });
        if (!this.user.wishlist) this.user.wishlist = [];
        
        const index = this.user.wishlist.findIndex(id => id.toString() === productId.toString());
        if (index > -1) {
            this.user.wishlist.splice(index, 1);
        } else {
            this.user.wishlist.push(productId.toString());
        }
        localStorage.setItem('user', JSON.stringify(this.user));
        this.notify();
        return res.liked;

    },

    async fetchWishlist() {
        if (!this.user) return [];
        try {
            const list = await window.api.get('/user/wishlist');
            return Array.isArray(list) ? list : [];
        } catch (err) {
            console.error("Wishlist fetch error:", err);
            return [];
        }
    },


    async addToCart(productId, quantity = 1) {
        if (!this.user) {
            alert('Please login to add items to cart');
            if (typeof navigate === 'function') navigate('/auth');
            else window.location.href = '/auth.html';
            return false;
        }
        try {
            await window.api.post('/user/cart', { productId, quantity });
            await this.fetchCart();
            return true;
        } catch (err) {
            console.error("Cart error:", err);
            return false;
        }
    },

    listeners: [],
    subscribe(callback) {
        this.listeners.push(callback);
    },
    notify() {
        this.updateNavbar();
        this.listeners.forEach(cb => cb(this));
    },

    updateNavbar() {
        const authLinks = document.getElementById('auth-links');
        if (!authLinks) return;
        
        if (this.user) {
            authLinks.innerHTML = `
                ${this.user.isAdmin ? '<a href="/admin" class="nav-admin" style="color: var(--secondary); font-weight: 700; margin-right: 1rem;"><i class="fa-solid fa-gauge-high"></i> Admin</a>' : ''}
                <a href="/account" class="nav-user">
                    <i class="fa-solid fa-circle-user"></i> 
                    <span>${this.user.name.split(' ')[0]}</span>
                </a>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="/auth" class="btn btn-outline" style="padding: 0.4rem 1.2rem; font-size: 0.9rem;">Sign In</a>
            `;
        }
    }
};

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    store.updateNavbar();
    if (store.user) store.fetchCart();
});

// Global scroll effect for Navbar
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

window.store = store;
