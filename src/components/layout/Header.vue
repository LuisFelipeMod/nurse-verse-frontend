<template>
  <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
    <!-- Mobile menu button -->
    <button
      type="button"
      class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      @click="$emit('toggleSidebar')"
    >
      <Bars3Icon class="h-6 w-6" />
    </button>

    <!-- Separator -->
    <div class="h-6 w-px bg-gray-200 lg:hidden" />

    <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
      
      <div class="flex items-center gap-x-4 lg:gap-x-6">
        <!-- Notifications -->
        <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
          <BellIcon class="h-6 w-6" />
        </button>

        <!-- Separator -->
        <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

        <!-- Profile -->
        <div class="flex items-center space-x-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-nurse-500 to-primary-600">
            <UserIcon class="h-5 w-5 text-white" />
          </div>
          <div class="hidden lg:block">
            <p class="text-sm font-medium text-gray-900">Giovanna</p>
            <p class="text-xs text-gray-500">Enfermeira</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import { useDashboardStore } from '@/stores/dashboard'
import { useToast } from 'vue-toastification'

const router = useRouter()
const dashboardStore = useDashboardStore()
const toast = useToast()

const searchQuery = ref('')

defineEmits(['toggleSidebar'])

async function handleSearch() {
  if (!searchQuery.value.trim()) return
  
  try {
    const results = await dashboardStore.buscarGlobal(searchQuery.value)
    
    if (results.total === 0) {
      toast.info('Nenhum documento encontrado')
      return
    }
    
    // Navegar para a primeira página de resultados ou mostrar modal
    toast.success(`${results.total} documento(s) encontrado(s)`)
    
    // Aqui você pode implementar navegação para página de resultados
    // ou mostrar um modal com os resultados
    
  } catch (error) {
    console.error('Erro na busca:', error)
  }
}
</script>
