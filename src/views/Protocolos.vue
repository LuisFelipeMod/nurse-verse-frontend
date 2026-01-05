<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          Protocolos de Enfermagem
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Gerencie e organize seus protocolos de enfermagem
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          @click="showCreateModal = true"
          class="btn btn-primary flex"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Novo Protocolo
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
            placeholder="Buscar protocolos..."
            class="input"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select v-model="filters.categoria" class="input" @change="fetchProtocolos">
            <option value="">Todas as categorias</option>
            <option value="Medicação">Medicação</option>
            <option value="Procedimentos">Procedimentos</option>
            <option value="Cuidados">Cuidados</option>
            <option value="Emergência">Emergência</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select v-model="filters.status" class="input" @change="fetchProtocolos">
            <option value="">Todos os status</option>
            <option value="rascunho">Rascunho</option>
            <option value="publicado">Publicado</option>
            <option value="arquivado">Arquivado</option>
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

    <!-- Protocols List -->
    <div class="card">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="protocolos.length === 0" class="text-center py-12">
        <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum protocolo encontrado</h3>
        <p class="mt-1 text-sm text-gray-500">
          Comece criando seu primeiro protocolo.
        </p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="btn btn-primary flex"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Novo Protocolo
          </button>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="protocolo in protocolos"
          :key="protocolo._id"
          class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ protocolo.titulo }}
                </h3>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(protocolo.status)
                  ]"
                >
                  {{ getStatusText(protocolo.status) }}
                </span>
              </div>
              
              <p class="mt-2 text-sm text-gray-600 line-clamp-2">
                {{ getContentPreview(protocolo.conteudo) }}
              </p>
              
              <div class="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                <span>{{ protocolo.categoria || 'Sem categoria' }}</span>
                <span>•</span>
                <span>Versão {{ protocolo.versao }}</span>
                <span>•</span>
                <span>{{ formatDate(protocolo.updatedAt) }}</span>
              </div>
              
              <div v-if="protocolo.tags && protocolo.tags.length > 0" class="mt-3">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in protocolo.tags"
                    :key="tag"
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="ml-6 flex items-center space-x-2">
              <button
                @click="viewProtocolo(protocolo)"
                class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Visualizar"
              >
                <EyeIcon class="h-5 w-5" />
              </button>
              <button
                @click="editProtocolo(protocolo)"
                class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                title="Editar"
              >
                <PencilIcon class="h-5 w-5" />
              </button>
              <button
                @click="deleteProtocolo(protocolo)"
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
    <ProtocoloModal
      v-if="showCreateModal || showEditModal"
      :protocolo="selectedProtocolo"
      :isEdit="showEditModal"
      @close="closeModals"
      @save="handleSave"
    />

    <!-- View Modal -->
    <ProtocoloViewModal
      v-if="showViewModal"
      :protocolo="selectedProtocolo"
      @close="showViewModal = false"
      @edit="editProtocolo"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useDocumentosStore } from '@/stores/documentos'
import { useToast } from 'vue-toastification'
import { debounce } from 'lodash-es'
import { createContentPreview } from '@/utils/textFormatter'
import ProtocoloModal from '@/components/modals/ProtocoloModal.vue'
import ProtocoloViewModal from '@/components/modals/ProtocoloViewModal.vue'

const route = useRoute()
const documentosStore = useDocumentosStore()
const toast = useToast()

const loading = computed(() => documentosStore.loading)
const protocolos = computed(() => documentosStore.documentos)
const currentPage = computed(() => documentosStore.currentPage)
const totalPages = computed(() => documentosStore.totalPages)

const filters = ref({
  search: '',
  categoria: '',
  status: ''
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedProtocolo = ref(null)

// Debounced search
const debouncedSearch = debounce(() => {
  fetchProtocolos()
}, 500)

onMounted(async () => {
  // Check if should open create modal from query params
  if (route.query.novo === 'true') {
    showCreateModal.value = true
  }
  
  await fetchProtocolos()
})

async function fetchProtocolos() {
  try {
    const params = {
      page: currentPage.value,
      ...filters.value
    }
    
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key]
    })
    
    await documentosStore.fetchDocumentos('protocolos', params)
  } catch (error) {
    console.error('Erro ao carregar protocolos:', error)
  }
}

function clearFilters() {
  filters.value = {
    search: '',
    categoria: '',
    status: ''
  }
  fetchProtocolos()
}

function changePage(page) {
  documentosStore.currentPage = page
  fetchProtocolos()
}

function viewProtocolo(protocolo) {
  selectedProtocolo.value = protocolo
  showViewModal.value = true
}

function editProtocolo(protocolo) {
  selectedProtocolo.value = protocolo
  showEditModal.value = true
}

async function deleteProtocolo(protocolo) {
  if (!confirm(`Tem certeza que deseja excluir o protocolo "${protocolo.titulo}"?`)) {
    return
  }
  
  try {
    await documentosStore.deleteDocumento('protocolos', protocolo._id)
    toast.success('Protocolo excluído com sucesso')
    fetchProtocolos()
  } catch (error) {
    console.error('Erro ao excluir protocolo:', error)
  }
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  selectedProtocolo.value = null
}

async function handleSave(data) {
  try {
    if (showEditModal.value) {
      await documentosStore.updateDocumento('protocolos', selectedProtocolo.value._id, data)
      toast.success('Protocolo atualizado com sucesso')
    } else {
      await documentosStore.createDocumento('protocolos', data)
      toast.success('Protocolo criado com sucesso')
    }
    
    closeModals()
    fetchProtocolos()
  } catch (error) {
    console.error('Erro ao salvar protocolo:', error)
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
