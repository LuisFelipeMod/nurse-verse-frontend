<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Editar Protocolo' : 'Novo Protocolo' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                v-model="form.titulo"
                type="text"
                required
                class="input"
                placeholder="Digite o título do protocolo"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select v-model="form.categoria" class="input">
                <option value="">Selecione uma categoria</option>
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
              <select v-model="form.status" class="input">
                <option value="rascunho">Rascunho</option>
                <option value="publicado">Publicado</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>
            
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                v-model="tagsString"
                type="text"
                class="input"
                placeholder="Separadas por vírgula (ex: medicação, urgente)"
              />
            </div>
            
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo *
              </label>
              <textarea
                v-model="form.conteudo"
                rows="12"
                required
                class="textarea"
                placeholder="Descreva o protocolo detalhadamente..."
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary flex"
            >
              {{ isEdit ? 'Atualizar' : 'Criar' }} Protocolo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  protocolo: Object,
  isEdit: Boolean
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  titulo: '',
  categoria: '',
  status: 'rascunho',
  conteudo: '',
  tags: []
})

const tagsString = computed({
  get: () => form.value.tags.join(', '),
  set: (value) => {
    form.value.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag)
  }
})

onMounted(() => {
  if (props.isEdit && props.protocolo) {
    form.value = {
      titulo: props.protocolo.titulo || '',
      categoria: props.protocolo.categoria || '',
      status: props.protocolo.status || 'rascunho',
      conteudo: props.protocolo.conteudo || '',
      tags: props.protocolo.tags || []
    }
  }
})

function handleSubmit() {
  emit('save', { ...form.value })
}
</script>
