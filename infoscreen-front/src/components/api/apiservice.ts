// apiCallWrapper.ts

import { API_BASE_URL } from "../../apiConfig";



export const apiService = {
    get: (path: string) => {
        const token = localStorage.getItem('accessToken');
        return fetch(`${API_BASE_URL}${path}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Not authenticated');
            }
        });
        },
    post: (path: string, body: any, options: RequestInit = {}) => {
        const token = localStorage.getItem('accessToken');
        return fetch(`${API_BASE_URL}${path}`, {
            ...options,
            method: 'POST',
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Not authenticated');
            }
        });
        },
    put: (path: string, body: any, options: RequestInit = {}) => {
        const token = localStorage.getItem('accessToken');
        return fetch(`${API_BASE_URL}${path}`, {
            ...options,
            method: 'PUT',
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Not authenticated');
            }
        });
        },
    delete: (path: string, options: RequestInit = {}) => {
        const token = localStorage.getItem('accessToken');
        return fetch(`${API_BASE_URL}${path}`, {
            ...options,
            method: 'DELETE',
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Not authenticated');
            }
        });
        },
    
    
    
};


