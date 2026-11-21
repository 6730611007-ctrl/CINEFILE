import axios from 'axios'
import { defineBoot } from '#q-app'
import { useAuthStore } from '@/stores/auth-store.js'
import { pinia } from '@/stores/pinia.js'
import { api, setAccessTokenResolver } from '@/services/api.js'

export default defineBoot(({ app }) => {
  setAccessTokenResolver(() => useAuthStore(pinia).accessToken)
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
