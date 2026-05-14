const API_BASE = '/api';

const api = {
    async get(endpoint) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        return await response.json();
    },

    async post(endpoint, data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async put(endpoint, data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    },

    async delete(endpoint) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        return await response.json();
    }
};

window.api = api;
