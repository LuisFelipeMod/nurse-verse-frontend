import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useDocumentosStore = defineStore('documentos', () => {
  // Estado
  const documentos = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const selectedStatus = ref('')

  // Getters computados
  const protocolos = computed(() => 
    documentos.value.filter(doc => doc.tipo === 'protocolo')
  )
  
  const roteiros = computed(() => 
    documentos.value.filter(doc => doc.tipo === 'roteiro')
  )
  
  const anotacoes = computed(() => 
    documentos.value.filter(doc => doc.tipo === 'anotacao')
  )

  // Actions
  async function fetchDocumentos(tipo, params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/${tipo}`, { params })
      documentos.value = response.data[tipo] || response.data.documentos || []
      currentPage.value = response.data.currentPage || 1
      totalPages.value = response.data.totalPages || 1
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar documentos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDocumento(tipo, id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/${tipo}/${id}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao carregar documento'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createDocumento(tipo, data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post(`/${tipo}`, data)
      documentos.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao criar documento'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateDocumento(tipo, id, data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/${tipo}/${id}`, data)
      const index = documentos.value.findIndex(doc => doc._id === id)
      if (index !== -1) {
        documentos.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao atualizar documento'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDocumento(tipo, id) {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/${tipo}/${id}`)
      documentos.value = documentos.value.filter(doc => doc._id !== id)
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao excluir documento'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function uploadDocumento(formData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao fazer upload'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function previewDocumento(formData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/upload/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao gerar preview'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function setFilters(filters) {
    searchQuery.value = filters.search || ''
    selectedCategory.value = filters.categoria || ''
    selectedStatus.value = filters.status || ''
  }

  return {
    // Estado
    documentos,
    loading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    selectedCategory,
    selectedStatus,
    
    // Getters
    protocolos,
    roteiros,
    anotacoes,
    
    // Actions
    fetchDocumentos,
    fetchDocumento,
    createDocumento,
    updateDocumento,
    deleteDocumento,
    uploadDocumento,
    previewDocumento,
    clearError,
    setFilters
  }
})
