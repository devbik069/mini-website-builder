import { defineStore } from 'pinia'

// Define a Pinia store for authentication
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null
  }),
  getters: {
    isAuthenticated: state => !!state.token
  },
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    clearToken() {
      this.token = ''
      localStorage.removeItem('token')
      this.user = null
    },

    // Fetch authenticated user using stored token
    async fetchUser() {
      if (!this.token) return
      try {
        const response = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = response.data
      } catch {
        this.clearToken()
      }
    }
  }
})
