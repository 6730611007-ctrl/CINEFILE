import axios from 'axios'

let accessTokenResolver = () => null

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://6af9b8c46d8b86fb22d72f31.mockapi.io/api',
  timeout: 10000,
})

export function setAccessTokenResolver(resolver) {
  accessTokenResolver = resolver
}

api.interceptors.request.use((config) => {
  const token = accessTokenResolver()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
