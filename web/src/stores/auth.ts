import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    apiKey: localStorage.getItem('apiKey') || ''
  }),

  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setApiKey(apiKey: string) {
      this.apiKey = apiKey;
      localStorage.setItem('apiKey', apiKey);
    },

    clearAuth() {
      this.token = '';
      this.apiKey = '';
      localStorage.removeItem('token');
      localStorage.removeItem('apiKey');
    },

    async login(username: string, password: string) {
      try {
        const response = await fetch('http://localhost:5000/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.status === 'success') {
          this.setToken(data.token);
          return true;
        }
        return false;
      } catch (error) {
        console.error('登录失败:', error);
        return false;
      }
    },

    async createApiKey() {
      try {
        const response = await fetch('http://localhost:5000/api/keys', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        const data = await response.json();
        if (data.status === 'success') {
          this.setApiKey(data.api_key);
          return true;
        }
        return false;
      } catch (error) {
        console.error('创建API密钥失败:', error);
        return false;
      }
    }
  }
});