'use client';

import { useAuth } from './useAuth';

export function useApi() {
  const { logout } = useAuth();

  const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers
    };

    let response = await fetch(`http://localhost:3000${endpoint}`, { ...options, headers });

    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const refreshResponse = await fetch('http://localhost:3000/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('accessToken', data.accessToken);
          headers.Authorization = `Bearer ${data.accessToken}`;
          response = await fetch(`http://localhost:3000${endpoint}`, { ...options, headers });
        } else {
          logout();
        }
      } else {
        logout();
      }
    }

    return response;
  };

  return { apiCall };
}
