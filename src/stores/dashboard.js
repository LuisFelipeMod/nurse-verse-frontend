import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useDashboardStore = defineStore('dashboard', () => {
  // Estado
  const estatisticas = ref([])
  const recentes = ref([])
  const categorias = ref([])
  const atividadeRecente = ref([])
  const resumo = ref({})
  const loading = ref(false)
  const error = ref(null)

  // Actions
  async function fetchDashboardData() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/dashboard')
      
      estatisticas.value = response.data.estatisticas || []
      recentes.value = response.data.recentes || []
      categorias.value = response.data.categorias || []
      atividadeRecente.value = response.data.atividadeRecente || []
      resumo.value = response.data.resumo || {}
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar dados do dashboard'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function buscarGlobal(query, limite = 10) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/dashboard/busca', {
        params: { q: query, limite }
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro na busca'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // Estado
    estatisticas,
    recentes,
    categorias,
    atividadeRecente,
    resumo,
    loading,
    error,
    
    // Actions
    fetchDashboardData,
    buscarGlobal,
    clearError
  }
})
