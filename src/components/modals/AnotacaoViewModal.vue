<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-3xl bg-white rounded-lg shadow-xl">
        <div class="flex items-center justify-between p-6 border-b">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ anotacao?.titulo }}
            </h3>
            <div class="flex items-center space-x-3 mt-1 text-sm text-gray-500">
              <span
                v-if="anotacao?.categoria"
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
                  getCategoryColor(anotacao?.categoria)
                ]"
              >
                {{ anotacao.categoria }}
              </span>
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(anotacao?.status)
                ]"
              >
                {{ getStatusText(anotacao?.status) }}
              </span>
              <span>{{ formatDate(anotacao?.createdAt) }}</span>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('edit', anotacao)"
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
          <div v-if="anotacao?.tags && anotacao.tags.length > 0" class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Tags</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in anotacao.tags"
                :key="tag"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-nurse-100 text-nurse-800"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- Conteúdo -->
          <div class="prose max-w-none">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Conteúdo</h4>
            <div class="bg-gray-50 border rounded-lg p-4">
              <div v-html="formatContentForModal(anotacao?.conteudo)" class="text-gray-800 leading-relaxed"></div>
            </div>
          </div>
          
          <!-- Informações adicionais -->
          <div class="mt-8 pt-6 border-t">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span class="font-medium text-gray-700">Criado em:</span>
                <span class="ml-2">{{ formatFullDate(anotacao?.createdAt) }}</span>
              </div>
              <div v-if="anotacao?.updatedAt !== anotacao?.createdAt">
                <span class="font-medium text-gray-700">Atualizado em:</span>
                <span class="ml-2">{{ formatFullDate(anotacao?.updatedAt) }}</span>
              </div>
              <div v-if="anotacao?.autor">
                <span class="font-medium text-gray-700">Autor:</span>
                <span class="ml-2">{{ anotacao.autor }}</span>
              </div>
              <div v-if="anotacao?.versao">
                <span class="font-medium text-gray-700">Versão:</span>
                <span class="ml-2">{{ anotacao.versao }}</span>
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
  anotacao: Object
})

defineEmits(['close', 'edit'])

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
  const now = new Date()
  const diffInHours = Math.abs(now - date) / 36e5
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }
}

function formatFullDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
