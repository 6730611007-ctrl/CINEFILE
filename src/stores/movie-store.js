import { defineStore } from 'pinia'
import { api } from '@/services/api.js'
import { useAuthStore } from '@/stores/auth-store.js'

export const useMovieStore = defineStore('movies', {
  state: () => ({
    movies: [],
    loading: false,
    loaded: false,
    filters: { search: '' },
  }),

  getters: {
    isAdmin: () => useAuthStore().isAdmin,
    filteredMovies: (state) => {
      const search = state.filters.search.trim().toLowerCase()

      return state.movies.filter((movie) => {
        const matchesSearch =
          !search ||
          [movie.title, movie.genre, movie.description].some((value) =>
            value?.toLowerCase().includes(search),
          )
        return matchesSearch
      })
    },
  },

  actions: {
    canManageMovie(movie) {
      const auth = useAuthStore()
      return Boolean(
        movie &&
        (auth.isAdmin ||
          (auth.user?.id && movie.userId != null && String(movie.userId) === String(auth.user.id))),
      )
    },

    async loadMovies() {
      this.loading = true
      try {
        const { data: items } = await api.get('/item')
        this.movies = items
          .filter((item) => item.type === 'movie')
          .map((item) => {
            const movie = { ...item }
            delete movie.status
            return movie
          })
        this.loaded = true
      } finally {
        this.loading = false
      }
    },

    async addMovie(movie) {
      const auth = useAuthStore()
      if (!auth.isAdmin) {
        throw new Error('เพิ่มหนังได้เฉพาะผู้ดูแลระบบ')
      }
      if (!auth.user?.id) {
        throw new Error('กรุณาเข้าสู่ระบบอีกครั้ง')
      }

      const { data } = await api.post('/item', {
        ...movie,
        type: 'movie',
        userId: auth.user.id,
        userName: auth.user.name,
      })
      this.movies.unshift(data)
      return data
    },

    async updateMovie(id, movie) {
      const index = this.movies.findIndex((item) => String(item.id) === String(id))
      const existing = this.movies[index]

      if (!existing) {
        throw new Error('ไม่พบหนังเรื่องนี้ในรายการ')
      }
      if (!this.canManageMovie(existing)) {
        throw new Error('คุณไม่มีสิทธิ์แก้ไขหนังเรื่องนี้')
      }

      const { data } = await api.put(`/item/${id}`, {
        ...existing,
        ...movie,
        type: 'movie',
        userId: existing.userId,
        userName: existing.userName,
      })
      this.movies[index] = data
      return data
    },

    async deleteMovie(id) {
      const movie = this.movies.find((item) => String(item.id) === String(id))
      if (!movie) {
        throw new Error('ไม่พบหนังเรื่องนี้ในรายการ')
      }
      if (!this.canManageMovie(movie)) {
        throw new Error('คุณไม่มีสิทธิ์ลบหนังเรื่องนี้')
      }

      await api.delete(`/item/${id}`)
      this.movies = this.movies.filter((item) => String(item.id) !== String(id))
    },
  },
})
