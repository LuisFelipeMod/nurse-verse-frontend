<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          Roteiros de Enfermagem
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Gerencie e organize seus roteiros de procedimentos e cuidados
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          @click="showCreateModal = true"
          class="btn btn-primary flex"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Novo Roteiro
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Buscar roteiros..."
            class="input"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select v-model="filters.categoria" class="input" @change="fetchRoteiros">
            <option value="">Todas as categorias</option>
            <option value="Admissão">Admissão</option>
            <option value="Medicação">Medicação</option>
            <option value="Cuidados Básicos">Cuidados Básicos</option>
            <option value="Procedimentos">Procedimentos</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Complexidade
          </label>
          <select v-model="filters.complexidade" class="input" @change="fetchRoteiros">
            <option value="">Todas</option>
            <option value="basico">Básico</option>
            <option value="intermediario">Intermediário</option>
            <option value="avancado">Avançado</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="btn btn-secondary w-full"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Roteiros List -->
    <div class="card">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="roteiros.length === 0" class="text-center py-12">
        <MapIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum roteiro encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">
          Comece criando seu primeiro roteiro de procedimentos.
        </p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="btn btn-primary flex"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Novo Roteiro
          </button>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="roteiro in roteiros"
          :key="roteiro._id"
          class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ roteiro.titulo }}
                </h3>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(roteiro.status)
                  ]"
                >
                  {{ getStatusText(roteiro.status) }}
                </span>
                <span
                  v-if="roteiro.metadados?.nivelComplexidade"
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
                    getComplexityColor(roteiro.metadados.nivelComplexidade)
                  ]"
                >
                  {{ getComplexityText(roteiro.metadados.nivelComplexidade) }}
                </span>
              </div>
              
              <p class="mt-2 text-sm text-gray-600 line-clamp-2">
                {{ getContentPreview(roteiro.conteudo) }}
              </p>
              
              <div class="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <span>{{ roteiro.categoria || 'Sem categoria' }}</span>
                <span>•</span>
                <span>Versão {{ roteiro.versao }}</span>
                <span>•</span>
                <span>{{ formatDate(roteiro.updatedAt) }}</span>
              </div>
              
              <div v-if="roteiro.tags && roteiro.tags.length > 0" class="mt-3">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in roteiro.tags"
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-nurse-100 text-nurse-800"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="ml-6 flex items-center space-x-2">
              <button
                @click="viewRoteiro(roteiro)"
                class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Visualizar"
              >
                <EyeIcon class="h-5 w-5" />
              </button>
              <button
                @click="editRoteiro(roteiro)"
                class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Editar"
              >
                <PencilIcon class="h-5 w-5" />
              </button>
              <button
                @click="duplicateRoteiro(roteiro)"
                class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Duplicar"
              >
                <DocumentDuplicateIcon class="h-5 w-5" />
              </button>
              <button
                @click="deleteRoteiro(roteiro)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Excluir"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Página {{ currentPage }} de {{ totalPages }}
      </div>
      <div class="flex space-x-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próxima
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <RoteiroModal
      v-if="showCreateModal || showEditModal"
      :roteiro="selectedRoteiro"
      :isEdit="showEditModal"
      @close="closeModals"
      @save="handleSave"
    />

    <!-- View Modal -->
    <RoteiroViewModal
      v-if="showViewModal"
      :roteiro="selectedRoteiro"
      @close="showViewModal = false"
      @edit="editRoteiro"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  PlusIcon,
  MapIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'
import { useDocumentosStore } from '@/stores/documentos'
import { useToast } from 'vue-toastification'
import { debounce } from 'lodash-es'
import { createContentPreview } from '@/utils/textFormatter'
import RoteiroModal from '@/components/modals/RoteiroModal.vue'
import RoteiroViewModal from '@/components/modals/RoteiroViewModal.vue'

const route = useRoute()
const documentosStore = useDocumentosStore()
const toast = useToast()

const loading = computed(() => documentosStore.loading)
const roteiros = computed(() => documentosStore.documentos)
const currentPage = computed(() => documentosStore.currentPage)
const totalPages = computed(() => documentosStore.totalPages)

const filters = ref({
  search: '',
  categoria: '',
  complexidade: ''
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedRoteiro = ref(null)

// Debounced search
const debouncedSearch = debounce(() => {
  fetchRoteiros()
}, 500)

onMounted(async () => {
  // Check if should open create modal from query params
  if (route.query.novo === 'true') {
    showCreateModal.value = true
  }
  
  await fetchRoteiros()
})

async function fetchRoteiros() {
  try {
    const params = {
      page: currentPage.value,
      ...filters.value
    }
    
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key]
    })
    
    await documentosStore.fetchDocumentos('roteiros', params)
  } catch (error) {
    console.error('Erro ao carregar roteiros:', error)
  }
}

function clearFilters() {
  filters.value = {
    search: '',
    categoria: '',
    complexidade: ''
  }
  fetchRoteiros()
}

function changePage(page) {
  documentosStore.currentPage = page
  fetchRoteiros()
}

function viewRoteiro(roteiro) {
  selectedRoteiro.value = roteiro
  showViewModal.value = true
}

function editRoteiro(roteiro) {
  selectedRoteiro.value = roteiro
  showEditModal.value = true
}

async function duplicateRoteiro(roteiro) {
  try {
    const duplicatedData = {
      titulo: `${roteiro.titulo} (Cópia)`,
      conteudo: roteiro.conteudo,
      categoria: roteiro.categoria,
      tags: [...(roteiro.tags || [])],
      metadados: { ...roteiro.metadados },
      status: 'rascunho'
    }
    
    await documentosStore.createDocumento('roteiros', duplicatedData)
    toast.success('Roteiro duplicado com sucesso')
    fetchRoteiros()
  } catch (error) {
    console.error('Erro ao duplicar roteiro:', error)
  }
}

async function deleteRoteiro(roteiro) {
  if (!confirm(`Tem certeza que deseja excluir o roteiro "${roteiro.titulo}"?`)) {
    return
  }
  
  try {
    await documentosStore.deleteDocumento('roteiros', roteiro._id)
    toast.success('Roteiro excluído com sucesso')
    fetchRoteiros()
  } catch (error) {
    console.error('Erro ao excluir roteiro:', error)
  }
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  selectedRoteiro.value = null
}

async function handleSave(data) {
  try {
    if (showEditModal.value) {
      await documentosStore.updateDocumento('roteiros', selectedRoteiro.value._id, data)
      toast.success('Roteiro atualizado com sucesso')
    } else {
      await documentosStore.createDocumento('roteiros', data)
      toast.success('Roteiro criado com sucesso')
    }
    
    closeModals()
    fetchRoteiros()
  } catch (error) {
    console.error('Erro ao salvar roteiro:', error)
  }
}

function getStatusColor(status) {
  const colors = {
    rascunho: 'bg-yellow-100 text-yellow-800',
    publicado: 'bg-green-100 text-green-800',
    arquivado: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getStatusText(status) {
  const texts = {
    rascunho: 'Rascunho',
    publicado: 'Publicado',
    arquivado: 'Arquivado'
  }
  return texts[status] || status
}

function getComplexityColor(complexity) {
  const colors = {
    basico: 'bg-green-100 text-green-800',
    intermediario: 'bg-yellow-100 text-yellow-800',
    avancado: 'bg-red-100 text-red-800'
  }
  return colors[complexity] || 'bg-gray-100 text-gray-800'
}

function getComplexityText(complexity) {
  const texts = {
    basico: 'Básico',
    intermediario: 'Intermediário',
    avancado: 'Avançado'
  }
  return texts[complexity] || complexity
}

function getContentPreview(content) {
  return createContentPreview(content, 150)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
