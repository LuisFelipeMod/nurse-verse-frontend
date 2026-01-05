import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

// Criar instância do axios
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('nurseverse_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Erro desconhecido'
    
    // Mostrar toast de erro
    if (error.response?.status !== 404) { // Não mostrar toast para 404
      toast.error(message)
    }
    
    // Tratar erros específicos
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('nurseverse_token')
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
