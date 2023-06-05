import { API_BASE_URL } from "../../apiConfig";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const refreshTokenAndRetry = async (originalRequest: Request): Promise<Response> => {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            refreshSubscribers.push((token: string) => {
                originalRequest.headers.set('Authorization', `Bearer ${token}`);
                resolve(fetch(originalRequest))
            });
            refreshSubscribers.push(() => reject('Refresh token failed'));
        });
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch(`${API_BASE_URL}/login/refreshToken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ token: refreshToken}),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.set('Authorization', `Bearer ${data.accessToken}`);
        isRefreshing = false;
        refreshSubscribers.forEach(cb => cb(data.accessToken));
        refreshSubscribers = [];
        return fetch(originalRequest);
    } else {
        throw new Error('Refresh token failed');
    }
};

export const apiService = {
    get: async (path: string) => {
        const token = localStorage.getItem('accessToken');
        const originalRequest = new Request(`${API_BASE_URL}${path}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const response = await fetch(originalRequest);

        if (response.ok) {
            return response.json();
        } else {
            const retryResponse = await refreshTokenAndRetry(originalRequest);
            if (retryResponse.ok) {
                return retryResponse.json();
            } else {
                throw new Error('Request failed after token refresh');
            }
        }
    },
    post: async (path: string, body: any) => {
        const token = localStorage.getItem('accessToken');
        const originalRequest = new Request(`${API_BASE_URL}${path}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const response = await fetch(originalRequest);

        if (response.ok) {
            return response.json();
        } else {
            const retryResponse = await refreshTokenAndRetry(originalRequest);
            if (retryResponse.ok) {
                return retryResponse.json();
            } else {
                throw new Error('Request failed after token refresh');
            }
        }
    },
    put: async (path: string, body: any) => {
        const token = localStorage.getItem('accessToken');
        const originalRequest = new Request(`${API_BASE_URL}${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const response = await fetch(originalRequest);

        if (response.ok) {
            return response.json();
        } else {
            const retryResponse = await refreshTokenAndRetry(originalRequest);
            if (retryResponse.ok) {
                return retryResponse.json();
            } else {
                throw new Error('Request failed after token refresh');
            }
        }
    },
    delete: async (path: string) => {
        const token = localStorage.getItem('accessToken');
        const originalRequest = new Request(`${API_BASE_URL}${path}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const response = await fetch(originalRequest);

        if (response.ok) {
            return response.json();
        } else {
            const retryResponse = await refreshTokenAndRetry(originalRequest);
            if (retryResponse.ok) {
                return retryResponse.json();
            } else {
                throw new Error('Request failed after token refresh');
            }
        }
    },
};
