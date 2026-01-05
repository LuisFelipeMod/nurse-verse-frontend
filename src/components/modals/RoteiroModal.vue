<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="$emit('close')"></div>
      
      <div class="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Editar Roteiro' : 'Novo Roteiro' }}
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
                placeholder="Digite o título do roteiro"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select v-model="form.categoria" class="input">
                <option value="">Selecione uma categoria</option>
                <option value="Admissão">Admissão</option>
                <option value="Medicação">Medicação</option>
                <option value="Cuidados Básicos">Cuidados Básicos</option>
                <option value="Procedimentos">Procedimentos</option>
                <option value="Alta">Alta</option>
                <option value="Emergência">Emergência</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nível de Complexidade
              </label>
              <select v-model="form.nivelComplexidade" class="input">
                <option value="">Selecione o nível</option>
                <option value="basico">Básico</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
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
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Especialidade
              </label>
              <input
                v-model="form.especialidade"
                type="text"
                class="input"
                placeholder="Ex: UTI, Pediatria, Cirúrgica"
              />
            </div>
            
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                v-model="tagsString"
                type="text"
                class="input"
                placeholder="Separadas por vírgula (ex: procedimento, cuidado, rotina)"
              />
            </div>
            
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Palavras-chave
              </label>
              <input
                v-model="palavrasChaveString"
                type="text"
                class="input"
                placeholder="Palavras para facilitar a busca (separadas por vírgula)"
              />
            </div>
            
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo do Roteiro *
              </label>
              <textarea
                v-model="form.conteudo"
                rows="15"
                required
                class="textarea"
                placeholder="Descreva o roteiro passo a passo:

1. Preparação
   - Material necessário
   - Equipamentos
   
2. Procedimento
   - Passo 1: ...
   - Passo 2: ...
   
3. Cuidados pós-procedimento
   - Observações
   - Registros necessários"
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
              {{ isEdit ? 'Atualizar' : 'Criar' }} Roteiro
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
  roteiro: Object,
  isEdit: Boolean
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  titulo: '',
  categoria: '',
  status: 'rascunho',
  conteudo: '',
  tags: [],
  nivelComplexidade: '',
  especialidade: '',
  palavrasChave: []
})

const tagsString = computed({
  get: () => form.value.tags.join(', '),
  set: (value) => {
    form.value.tags = value.split(',').map(tag => tag.trim()).filter(tag => tag)
  }
})

const palavrasChaveString = computed({
  get: () => form.value.palavrasChave.join(', '),
  set: (value) => {
    form.value.palavrasChave = value.split(',').map(palavra => palavra.trim()).filter(palavra => palavra)
  }
})

onMounted(() => {
  if (props.isEdit && props.roteiro) {
    form.value = {
      titulo: props.roteiro.titulo || '',
      categoria: props.roteiro.categoria || '',
      status: props.roteiro.status || 'rascunho',
      conteudo: props.roteiro.conteudo || '',
      tags: props.roteiro.tags || [],
      nivelComplexidade: props.roteiro.metadados?.nivelComplexidade || '',
      especialidade: props.roteiro.metadados?.especialidade || '',
      palavrasChave: props.roteiro.metadados?.palavrasChave || []
    }
  }
})

function handleSubmit() {
  const data = {
    titulo: form.value.titulo,
    categoria: form.value.categoria,
    status: form.value.status,
    conteudo: form.value.conteudo,
    tags: form.value.tags,
    metadados: {
      nivelComplexidade: form.value.nivelComplexidade,
      especialidade: form.value.especialidade,
      palavrasChave: form.value.palavrasChave
    }
  }
  
  emit('save', data)
}
</script>
