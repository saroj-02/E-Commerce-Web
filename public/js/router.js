const routes = {
    '/': { title: 'Home', render: renderHome },
    '/shop': { title: 'Shop', render: renderShop },
    '/cart': { title: 'Cart', render: renderCart },
    '/account': { title: 'Account', render: renderAccount },
    '/auth': { title: 'Authentication', render: renderAuth },
    '/admin': { title: 'Admin Dashboard', render: renderAdmin }
};

function navigate(path, push = true) {
    // Normalize path
    if (path.endsWith('.html')) path = '/' + path.replace('.html', '');
    if (path === '/index') path = '/';

    const route = routes[path] || routes['/'];
    
    if (push) {
        history.pushState({ path }, route.title, path);
    }

    document.title = `AURA | ${route.title}`;
    route.render();
    window.scrollTo(0, 0); // Always scroll to top
    
    // Update active nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === path || (path === '/' && href === '/index.html')) {
            link.style.color = 'var(--primary)';
        } else {
            link.style.color = '';
        }
    });
}

// Intercept clicks on <a> tags
document.addEventListener('click', e => {
    const el = e.target.closest('a');
    if (!el) return;

    const href = el.getAttribute('href');
    if (href && href.startsWith('/') && el.target !== '_blank' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(href);
    }
});

window.addEventListener('popstate', e => {
    const path = window.location.pathname;
    navigate(path, false);
});

// Initial routing
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    navigate(path, false);
});
