<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <div class="flex items-center justify-between p-6 border-b">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ roteiro?.titulo }}
            </h3>
            <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
              <span>{{ roteiro?.categoria || 'Sem categoria' }}</span>
              <span>•</span>
              <span>Versão {{ roteiro?.versao }}</span>
              <span>•</span>
              <span
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(roteiro?.status)
                ]"
              >
                {{ getStatusText(roteiro?.status) }}
              </span>
              <span
                v-if="roteiro?.metadados?.nivelComplexidade"
                :class="[
                  'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ml-2',
                  getComplexityColor(roteiro?.metadados?.nivelComplexidade)
                ]"
              >
                {{ getComplexityText(roteiro?.metadados?.nivelComplexidade) }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="$emit('edit', roteiro)"
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
          <!-- Metadados -->
          <div v-if="hasMetadata" class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Informações do Roteiro</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div v-if="roteiro?.metadados?.especialidade">
                <span class="font-medium text-gray-700">Especialidade:</span>
                <span class="ml-2 text-gray-600">{{ roteiro.metadados.especialidade }}</span>
              </div>
              <div v-if="roteiro?.metadados?.nivelComplexidade">
                <span class="font-medium text-gray-700">Complexidade:</span>
                <span class="ml-2 text-gray-600">{{ getComplexityText(roteiro.metadados.nivelComplexidade) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Tags -->
          <div v-if="roteiro?.tags && roteiro.tags.length > 0" class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Tags</h4>
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
          
          <!-- Palavras-chave -->
          <div v-if="roteiro?.metadados?.palavrasChave && roteiro.metadados.palavrasChave.length > 0" class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">Palavras-chave</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="palavra in roteiro.metadados.palavrasChave"
                :key="palavra"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {{ palavra }}
              </span>
            </div>
          </div>
          
          <!-- Conteúdo -->
          <div class="prose max-w-none">
            <h4 class="text-sm font-medium text-gray-900 mb-4">Conteúdo do Roteiro</h4>
            <div class="bg-gray-50 border rounded-lg p-4">
              <div v-html="formatContentForModal(roteiro?.conteudo)" class="text-gray-800 leading-relaxed"></div>
            </div>
          </div>
          
          <!-- Informações de criação/atualização -->
          <div class="mt-8 pt-6 border-t text-sm text-gray-500">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <strong>Criado em:</strong> {{ formatDate(roteiro?.createdAt) }}
              </div>
              <div>
                <strong>Atualizado em:</strong> {{ formatDate(roteiro?.updatedAt) }}
              </div>
              <div v-if="roteiro?.autor">
                <strong>Autor:</strong> {{ roteiro.autor }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/outline'
import { formatContentForModal } from '@/utils/textFormatter'

const props = defineProps({
  roteiro: Object
})

defineEmits(['close', 'edit'])

const hasMetadata = computed(() => {
  return props.roteiro?.metadados?.especialidade || 
         props.roteiro?.metadados?.nivelComplexidade
})

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
