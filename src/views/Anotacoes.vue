<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          Anotações de Enfermagem
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Suas anotações e observações organizadas por data e categoria
        </p>
      </div>
      <div class="mt-4 flex space-x-3 md:ml-4 md:mt-0">
        <button
          @click="showCreateModal = true"
          class="btn btn-nurse flex"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Nova Anotação
        </button>
      </div>
    </div>

    <!-- Quick Add -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Anotação Rápida</h3>
        <button
          @click="showQuickAdd = !showQuickAdd"
          class="text-sm text-nurse-600 hover:text-nurse-700"
        >
          {{ showQuickAdd ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>
      
      <div v-if="showQuickAdd" class="space-y-4">
        <input
          v-model="quickNote.titulo"
          type="text"
          placeholder="Título da anotação..."
          class="input"
        />
        <textarea
          v-model="quickNote.conteudo"
          rows="3"
          placeholder="Escreva sua anotação aqui..."
          class="textarea"
        ></textarea>
        <div class="flex justify-between items-center">
          <select v-model="quickNote.categoria" class="input w-48">
            <option value="">Categoria (opcional)</option>
            <option value="Observação">Observação</option>
            <option value="Evolução">Evolução</option>
            <option value="Intercorrência">Intercorrência</option>
            <option value="Medicação">Medicação</option>
            <option value="Procedimento">Procedimento</option>
            <option value="Pessoal">Pessoal</option>
          </select>
          <button
            @click="saveQuickNote"
            :disabled="!quickNote.titulo || !quickNote.conteudo"
            class="btn btn-nurse disabled:opacity-50"
          >
            Salvar Anotação
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Buscar anotações..."
            class="input"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select v-model="filters.categoria" class="input" @change="fetchAnotacoes">
            <option value="">Todas as categorias</option>
            <option value="Observação">Observação</option>
            <option value="Evolução">Evolução</option>
            <option value="Intercorrência">Intercorrência</option>
            <option value="Medicação">Medicação</option>
            <option value="Procedimento">Procedimento</option>
            <option value="Pessoal">Pessoal</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Data Inicial
          </label>
          <input
            v-model="filters.dataInicial"
            type="date"
            class="input"
            @change="fetchAnotacoes"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Data Final
          </label>
          <input
            v-model="filters.dataFinal"
            type="date"
            class="input"
            @change="fetchAnotacoes"
          />
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

    <!-- View Toggle -->
    <div class="flex justify-between items-center">
      <div class="flex space-x-2">
        <button
          @click="viewMode = 'list'"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md',
            viewMode === 'list' 
              ? 'bg-nurse-100 text-nurse-700' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <ListBulletIcon class="h-4 w-4 mr-1 inline" />
          Lista
        </button>
        <button
          @click="viewMode = 'timeline'"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md',
            viewMode === 'timeline' 
              ? 'bg-nurse-100 text-nurse-700' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <ClockIcon class="h-4 w-4 mr-1 inline" />
          Timeline
        </button>
      </div>
      
      <div class="text-sm text-gray-500">
        {{ anotacoes.length }} anotação(ões) encontrada(s)
      </div>
    </div>

    <!-- Anotações Content -->
    <div class="card">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-nurse-600"></div>
      </div>
      
      <div v-else-if="anotacoes.length === 0" class="text-center py-12">
        <PencilSquareIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma anotação encontrada</h3>
        <p class="mt-1 text-sm text-gray-500">
          Comece criando sua primeira anotação.
        </p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="btn btn-nurse flex"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Nova Anotação
          </button>
        </div>
      </div>
      
      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="space-y-4">
        <div
          v-for="anotacao in anotacoes"
          :key="anotacao._id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-base font-medium text-gray-900">
                  {{ anotacao.titulo }}
                </h3>
                <span
                  v-if="anotacao.categoria"
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
                    getCategoryColor(anotacao.categoria)
                  ]"
                >
                  {{ anotacao.categoria }}
                </span>
              </div>
              
              <p class="mt-2 text-sm text-gray-600 line-clamp-3">
                {{ getContentPreview(anotacao.conteudo) }}
              </p>
              
              <div class="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                <span>{{ formatDate(anotacao.createdAt) }}</span>
                <span v-if="anotacao.tags && anotacao.tags.length > 0">
                  {{ anotacao.tags.length }} tag(s)
                </span>
              </div>
            </div>
            
            <div class="ml-4 flex items-center space-x-2">
              <button
                @click="viewAnotacao(anotacao)"
                class="p-2 text-gray-400 hover:text-nurse-600 transition-colors"
                title="Visualizar"
              >
                <EyeIcon class="h-4 w-4" />
              </button>
              <button
                @click="editAnotacao(anotacao)"
                class="p-2 text-gray-400 hover:text-nurse-600 transition-colors"
                title="Editar"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="deleteAnotacao(anotacao)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Excluir"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Timeline View -->
      <div v-else class="space-y-6">
        <div
          v-for="group in groupedByDate"
          :key="group.date"
          class="relative"
        >
          <div class="sticky top-0 z-10 bg-white py-2 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-900">
              {{ formatDateGroup(group.date) }}
            </h3>
          </div>
          
          <div class="mt-4 space-y-3">
            <div
              v-for="anotacao in group.anotacoes"
              :key="anotacao._id"
              class="relative pl-6 pb-4"
            >
              <div class="absolute left-0 top-2 w-2 h-2 bg-nurse-500 rounded-full"></div>
              <div class="absolute left-1 top-4 w-0.5 h-full bg-gray-200"></div>
              
              <div class="bg-white border rounded-lg p-4 shadow-sm">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2">
                      <h4 class="text-sm font-medium text-gray-900">
                        {{ anotacao.titulo }}
                      </h4>
                      <span
                        v-if="anotacao.categoria"
                        :class="[
                          'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium',
                          getCategoryColor(anotacao.categoria)
                        ]"
                      >
                        {{ anotacao.categoria }}
                      </span>
                    </div>
                    
                    <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                      {{ getContentPreview(anotacao.conteudo) }}
                    </p>
                    
                    <div class="mt-2 text-xs text-gray-500">
                      {{ formatTime(anotacao.createdAt) }}
                    </div>
                  </div>
                  
                  <div class="ml-3 flex items-center space-x-1">
                    <button
                      @click="viewAnotacao(anotacao)"
                      class="p-1 text-gray-400 hover:text-nurse-600 transition-colors"
                    >
                      <EyeIcon class="h-3 w-3" />
                    </button>
                    <button
                      @click="editAnotacao(anotacao)"
                      class="p-1 text-gray-400 hover:text-nurse-600 transition-colors"
                    >
                      <PencilIcon class="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
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
    <AnotacaoModal
      v-if="showCreateModal || showEditModal"
      :anotacao="selectedAnotacao"
      :isEdit="showEditModal"
      @close="closeModals"
      @save="handleSave"
    />

    <!-- View Modal -->
    <AnotacaoViewModal
      v-if="showViewModal"
      :anotacao="selectedAnotacao"
      @close="showViewModal = false"
      @edit="editAnotacao"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  PlusIcon,
  PencilSquareIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ListBulletIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { useDocumentosStore } from '@/stores/documentos'
import { useToast } from 'vue-toastification'
import { debounce } from 'lodash-es'
import { createContentPreview } from '@/utils/textFormatter'
import AnotacaoModal from '@/components/modals/AnotacaoModal.vue'
import AnotacaoViewModal from '@/components/modals/AnotacaoViewModal.vue'

const route = useRoute()
const documentosStore = useDocumentosStore()
const toast = useToast()

const loading = computed(() => documentosStore.loading)
const anotacoes = computed(() => documentosStore.documentos)
const currentPage = computed(() => documentosStore.currentPage)
const totalPages = computed(() => documentosStore.totalPages)

const showQuickAdd = ref(true)
const viewMode = ref('list')

const filters = ref({
  search: '',
  categoria: '',
  dataInicial: '',
  dataFinal: ''
})

const quickNote = ref({
  titulo: '',
  conteudo: '',
  categoria: ''
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedAnotacao = ref(null)

// Debounced search
const debouncedSearch = debounce(() => {
  fetchAnotacoes()
}, 500)

// Group anotações by date for timeline view
const groupedByDate = computed(() => {
  const groups = {}
  
  anotacoes.value.forEach(anotacao => {
    const date = new Date(anotacao.createdAt).toDateString()
    if (!groups[date]) {
      groups[date] = {
        date,
        anotacoes: []
      }
    }
    groups[date].anotacoes.push(anotacao)
  })
  
  return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date))
})

onMounted(async () => {
  if (route.query.novo === 'true') {
    showCreateModal.value = true
  }
  
  await fetchAnotacoes()
})

async function fetchAnotacoes() {
  try {
    const params = {
      page: currentPage.value,
      ...filters.value
    }
    
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key]
    })
    
    await documentosStore.fetchDocumentos('anotacoes', params)
  } catch (error) {
    console.error('Erro ao carregar anotações:', error)
  }
}

function clearFilters() {
  filters.value = {
    search: '',
    categoria: '',
    dataInicial: '',
    dataFinal: ''
  }
  fetchAnotacoes()
}

function changePage(page) {
  documentosStore.currentPage = page
  fetchAnotacoes()
}

async function saveQuickNote() {
  if (!quickNote.value.titulo || !quickNote.value.conteudo) return
  
  try {
    const data = {
      ...quickNote.value,
      tipo: 'anotacao',
      status: 'publicado'
    }
    
    await documentosStore.createDocumento('anotacoes', data)
    toast.success('Anotação salva com sucesso!')
    
    quickNote.value = {
      titulo: '',
      conteudo: '',
      categoria: ''
    }
    
    fetchAnotacoes()
  } catch (error) {
    console.error('Erro ao salvar anotação:', error)
  }
}

function viewAnotacao(anotacao) {
  selectedAnotacao.value = anotacao
  showViewModal.value = true
}

function editAnotacao(anotacao) {
  selectedAnotacao.value = anotacao
  showEditModal.value = true
}

async function deleteAnotacao(anotacao) {
  if (!confirm(`Tem certeza que deseja excluir a anotação "${anotacao.titulo}"?`)) {
    return
  }
  
  try {
    await documentosStore.deleteDocumento('anotacoes', anotacao._id)
    toast.success('Anotação excluída com sucesso')
    fetchAnotacoes()
  } catch (error) {
    console.error('Erro ao excluir anotação:', error)
  }
}

function closeModals() {
  showCreateModal.value = false
  showEditModal.value = false
  selectedAnotacao.value = null
}

async function handleSave(data) {
  try {
    if (showEditModal.value) {
      await documentosStore.updateDocumento('anotacoes', selectedAnotacao.value._id, data)
      toast.success('Anotação atualizada com sucesso')
    } else {
      await documentosStore.createDocumento('anotacoes', data)
      toast.success('Anotação criada com sucesso')
    }
    
    closeModals()
    fetchAnotacoes()
  } catch (error) {
    console.error('Erro ao salvar anotação:', error)
  }
}

function getCategoryColor(category) {
  const colors = {
    'Observação': 'bg-nurse-100 text-nurse-800',
    'Evolução': 'bg-green-100 text-green-800',
    'Intercorrência': 'bg-red-100 text-red-800',
    'Medicação': 'bg-purple-100 text-purple-800',
    'Procedimento': 'bg-yellow-100 text-yellow-800',
    'Pessoal': 'bg-gray-100 text-gray-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

function getContentPreview(content) {
  return createContentPreview(content, 120)
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

function formatDateGroup(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoje'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem'
  } else {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }
}

function formatTime(dateString) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
