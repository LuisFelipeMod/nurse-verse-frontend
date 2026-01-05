<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="min-w-0 flex-1">
      <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
        Upload de Documentos
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Converta seus documentos Word em protocolos, roteiros ou anotações
      </p>
    </div>

    <!-- Upload Area -->
    <div class="card">
      <div
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
        :class="[
          'border-2 border-dashed rounded-lg p-12 text-center transition-colors',
          isDragging ? 'border-nurse-400 bg-nurse-50' : 'border-gray-300'
        ]"
      >
        <CloudArrowUpIcon class="mx-auto h-16 w-16 text-gray-400 mb-4" />
        
        <div v-if="!selectedFile">
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Arraste seu documento aqui
          </h3>
          <p class="text-gray-500 mb-4">
            Ou clique para selecionar um arquivo
          </p>
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept=".docx,.doc,.txt"
            @change="handleFileSelect"
          />
          <button
            @click="$refs.fileInput.click()"
            class="btn btn-primary"
          >
            Selecionar Arquivo
          </button>
          <p class="text-xs text-gray-400 mt-2">
            Formatos suportados: .docx, .doc, .txt (máx. 10MB)
          </p>
        </div>
        
        <div v-else class="space-y-4">
          <div class="flex items-center justify-center space-x-3">
            <DocumentTextIcon class="h-8 w-8 text-primary-600" />
            <div>
              <p class="font-medium text-gray-900">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>
          
          <div class="flex space-x-3">
            <button
              @click="previewFile"
              :disabled="loading"
              class="btn btn-secondary"
            >
              {{ loading ? 'Gerando Preview...' : 'Preview' }}
            </button>
            <button
              @click="clearFile"
              class="btn btn-secondary"
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="preview" class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Preview do Documento</h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
            <div v-html="formatContentForModal(preview.preview)" class="text-gray-800 leading-relaxed"></div>
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              v-model="documentData.titulo"
              type="text"
              class="input"
              placeholder="Digite o título do documento"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select v-model="documentData.tipo" class="input">
              <option value="">Selecione o tipo</option>
              <option value="protocolo">Protocolo</option>
              <option value="roteiro">Roteiro</option>
              <option value="anotacao">Anotação</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <input
              v-model="documentData.categoria"
              type="text"
              class="input"
              placeholder="Ex: Medicação, Procedimentos"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              v-model="documentData.tags"
              type="text"
              class="input"
              placeholder="Separadas por vírgula"
            />
          </div>
          
          <div class="pt-4">
            <button
              @click="uploadDocument"
              :disabled="!canUpload || loading"
              class="btn btn-primary flex w-full"
            >
              {{ loading ? 'Salvando...' : 'Salvar Documento' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Uploads -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Uploads Recentes</h3>
      <div class="text-center py-8 text-gray-500">
        Nenhum upload realizado ainda
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  CloudArrowUpIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import { useDocumentosStore } from '@/stores/documentos'
import { useToast } from 'vue-toastification'
import { formatContentForModal } from '@/utils/textFormatter'

const documentosStore = useDocumentosStore()
const toast = useToast()

const loading = computed(() => documentosStore.loading)

const selectedFile = ref(null)
const preview = ref(null)
const isDragging = ref(false)

const documentData = ref({
  titulo: '',
  tipo: '',
  categoria: '',
  tags: ''
})

const canUpload = computed(() => {
  return documentData.value.titulo && 
         documentData.value.tipo && 
         selectedFile.value && 
         preview.value
})

function handleDrop(event) {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

function handleFile(file) {
  // Validate file type
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ]
  
  if (!allowedTypes.includes(file.type)) {
    toast.error('Tipo de arquivo não suportado. Use .docx, .doc ou .txt')
    return
  }
  
  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    toast.error('Arquivo muito grande. Máximo 10MB permitido.')
    return
  }
  
  selectedFile.value = file
  preview.value = null
  
  // Auto-fill title from filename
  const filename = file.name.replace(/\.[^/.]+$/, "")
  documentData.value.titulo = filename
}

async function previewFile() {
  if (!selectedFile.value) return
  
  const formData = new FormData()
  formData.append('documento', selectedFile.value)
  
  try {
    const result = await documentosStore.previewDocumento(formData)
    preview.value = result
    toast.success('Preview gerado com sucesso')
  } catch (error) {
    console.error('Erro ao gerar preview:', error)
  }
}

async function uploadDocument() {
  if (!canUpload.value) return
  
  const formData = new FormData()
  formData.append('documento', selectedFile.value)
  formData.append('titulo', documentData.value.titulo)
  formData.append('tipo', documentData.value.tipo)
  formData.append('categoria', documentData.value.categoria)
  formData.append('tags', documentData.value.tags)
  
  try {
    await documentosStore.uploadDocumento(formData)
    toast.success('Documento convertido e salvo com sucesso!')
    
    // Reset form
    clearFile()
    documentData.value = {
      titulo: '',
      tipo: '',
      categoria: '',
      tags: ''
    }
  } catch (error) {
    console.error('Erro no upload:', error)
  }
}

function clearFile() {
  selectedFile.value = null
  preview.value = null
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
