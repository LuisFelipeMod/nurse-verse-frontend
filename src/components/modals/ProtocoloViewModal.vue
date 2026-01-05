<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <div class="flex items-center justify-between p-6 border-b">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ protocolo?.titulo }}
            </h3>
            <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
              <span>{{ protocolo?.categoria || 'Sem categoria' }}</span>
              <span>•</span>
              <span>Versão {{ protocolo?.versao }}</span>
              <span>•</span>
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(protocolo?.status)
                ]"
              >
                {{ getStatusText(protocolo?.status) }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('edit', protocolo)"
              class="btn btn-secondary"
            >
              <PencilIcon class="h-4 w-4 mr-2" />
              Editar
            </button>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <!-- Tags -->
          <div v-if="protocolo?.tags && protocolo.tags.length > 0" class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Tags</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in protocolo.tags"
                :key="tag"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-nurse-100 text-nurse-800"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="prose max-w-none">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Conteúdo do Protocolo</h4>
            <div class="bg-gray-50 border rounded-lg p-4">
              <div v-html="formatContentForModal(protocolo?.conteudo)" class="text-gray-800 leading-relaxed"></div>
            </div>
          </div>
          
          <div class="mt-8 pt-6 border-t text-sm text-gray-500">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <strong>Criado em:</strong> {{ formatDate(protocolo?.createdAt) }}
              </div>
              <div>
                <strong>Atualizado em:</strong> {{ formatDate(protocolo?.updatedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/outline'
import { formatContentForModal } from '@/utils/textFormatter'

const props = defineProps({
  protocolo: Object
})

defineEmits(['close', 'edit'])

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

function formatDate(dateString) {
  if (!dateString) return ''
  
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
