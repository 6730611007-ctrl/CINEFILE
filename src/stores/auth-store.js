import { defineStore } from 'pinia'
import { api } from '@/services/api.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.user && state.accessToken),
    isAdmin: (state) => state.user?.role?.toLowerCase() === 'admin',
  },

  actions: {
    initialize() {
      if (this.initialized) return

      if (typeof window !== 'undefined') {
        const previousToken = window.localStorage.getItem('watchlist-token')
        if (!this.accessToken && previousToken) {
          try {
            this.user = JSON.parse(window.localStorage.getItem('watchlist-user') || 'null')
            this.accessToken = previousToken
            window.localStorage.removeItem('watchlist-user')
            window.localStorage.removeItem('watchlist-token')
          } catch {
            window.localStorage.removeItem('watchlist-user')
            window.localStorage.removeItem('watchlist-token')
            this.user = null
            this.accessToken = null
          }
        }
      }

      this.initialized = true
    },

    saveSession(user) {
      const publicUser = { ...user }
      delete publicUser.password
      this.user = publicUser
      this.accessToken = `mock-${user.id}-${Date.now()}`
      this.initialized = true
      return this.user
    },

    async login({ identifier, password }) {
      const normalizedIdentifier = identifier.trim().toLowerCase()
      const { data: items } = await api.get('/item')
      const users = items.filter((item) => item.type === 'user')
      const user = users.find(
        (candidate) =>
          (candidate.email?.toLowerCase() === normalizedIdentifier ||
            candidate.username?.toLowerCase() === normalizedIdentifier) &&
          candidate.password === password,
      )

      if (!user) {
        throw new Error('ชื่อผู้ใช้ อีเมล หรือรหัสผ่านไม่ถูกต้อง')
      }

      return this.saveSession(user)
    },

    async register({ name, email, password }) {
      const normalizedEmail = email.trim().toLowerCase()
      const { data: items } = await api.get('/item')
      const users = items.filter((item) => item.type === 'user')

      if (users.some((user) => user.email?.toLowerCase() === normalizedEmail)) {
        throw new Error('อีเมลนี้ถูกใช้งานแล้ว')
      }

      const { data: user } = await api.post('/item', {
        type: 'user',
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: 'user',
      })

      return this.saveSession(user)
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.initialized = true
    },
  },
  persist: {
    key: 'watchlist-auth',
    pick: ['user', 'accessToken'],
  },
})
