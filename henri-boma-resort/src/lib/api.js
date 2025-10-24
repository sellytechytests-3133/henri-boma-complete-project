import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.thehenriboma.com/api'
const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL || 'https://media.thehenriboma.com'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`API Error: ${error.response?.status} ${error.response?.data?.message}`)
    return Promise.reject(error)
  }
)

export { api, API_BASE_URL, MEDIA_BASE_URL }
export default api