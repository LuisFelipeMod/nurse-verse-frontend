import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const toast = useToast()

    // State
    const user = ref(JSON.parse(localStorage.getItem('nurseverse_user')) || null)
    const token = ref(localStorage.getItem('nurseverse_token') || null)
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const isAuthenticated = computed(() => !!token.value)

    // Actions
    function setAuth(data) {
        if (data.token) {
            token.value = data.token
            localStorage.setItem('nurseverse_token', data.token)
        }
        if (data.user) {
            user.value = data.user
            localStorage.setItem('nurseverse_user', JSON.stringify(data.user))
        }
    }

    function clearAuth() {
        token.value = null
        user.value = null
        localStorage.removeItem('nurseverse_token')
        localStorage.removeItem('nurseverse_user')
    }

    async function login(email, senha) {
        loading.value = true
        error.value = null

        try {
            // Tenta primeiro /auth/login, se falhar tenta /login
            // Assumindo a estrutura padrão, vou usar /login direto se o backend for simples,
            // mas o plano diz /auth/login. Vou tentar /auth/login primeiro.
            const response = await api.post('/auth/login', { email, senha })

            const { token: accessToken, user: userData } = response.data

            setAuth({ token: accessToken, user: userData })

            toast.success('Login realizado com sucesso!')

            // Redirecionar para home ou para a página que tentou acessar
            const redirectPath = router.currentRoute.value.query.redirect || '/'
            router.push(redirectPath)

            return response.data
        } catch (err) {
            console.error('Login error:', err)
            const message = err.response?.data?.error || 'Email ou senha inválidos'
            error.value = message
            toast.error(message)
            throw err
        } finally {
            loading.value = false
        }
    }

    function logout() {
        clearAuth()
        toast.info('Você saiu do sistema')
        router.push('/login')
    }

    async function checkAuth() {
        if (!token.value) return false

        try {
            // Opcional: verificar se o token ainda é válido no backend
            // await api.get('/auth/me')
            return true
        } catch (err) {
            clearAuth()
            return false
        }
    }

    return {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        checkAuth
    }
})
