<template>
  <div class="flex h-full flex-col">
    <!-- Logo/Header -->
    <div class="flex h-16 shrink-0 items-center">
      <div class="flex items-center space-x-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-nurse-500 to-primary-600">
          <HeartIcon class="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">NurseVerse</h1>
          <p class="text-xs text-gray-500">Documentos de Enfermagem</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <RouterLink
                :to="item.href"
                :class="[
                  isCurrentRoute(item.current)
                    ? 'bg-gray-50 text-nurse-600'
                    : 'text-gray-700 hover:text-nurse-600 hover:bg-gray-50',
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                ]"
              >
                <component
                  :is="item.icon"
                  :class="[
                    isCurrentRoute(item.current) ? 'text-nurse-600' : 'text-gray-400 group-hover:text-nurse-600',
                    'h-6 w-6 shrink-0'
                  ]"
                />
                {{ item.name }}
                <span
                  v-if="item.count"
                  :class="[
                    isCurrentRoute(item.current)
                      ? 'bg-nurse-600 text-white'
                      : 'bg-gray-200 text-gray-600 group-hover:bg-nurse-600 group-hover:text-white',
                    'ml-auto inline-block py-0.5 px-2 text-xs rounded-full'
                  ]"
                >
                  {{ item.count }}
                </span>
              </RouterLink>
            </li>
          </ul>
        </li>
        
        <!-- Estatísticas rápidas -->
        <li class="mt-auto">
          <div class="rounded-lg bg-gradient-to-r from-nurse-50 to-primary-50 p-4">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ChartBarIcon class="h-6 w-6 text-nurse-600" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">Documentos</p>
                <p class="text-xs text-gray-600">{{ totalDocumentos }} no total</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  DocumentTextIcon,
  MapIcon,
  CloudArrowUpIcon,
  PencilSquareIcon,
  HeartIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
import { useDashboardStore } from '@/stores/dashboard'

const route = useRoute()
const dashboardStore = useDashboardStore()

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: 'home' },
  { name: 'Protocolos', href: '/protocolos', icon: DocumentTextIcon, current: 'protocolos' },
  { name: 'Roteiros', href: '/roteiros', icon: MapIcon, current: 'roteiros' },
  { name: 'Upload', href: '/upload', icon: CloudArrowUpIcon, current: 'upload' },
  { name: 'Anotações', href: '/anotacoes', icon: PencilSquareIcon, current: 'anotacoes' }
]

// Função para verificar se a rota atual está ativa
const isCurrentRoute = (routeName) => {
  return route.name === routeName
}

const totalDocumentos = computed(() => {
  return dashboardStore.resumo?.totalDocumentos || 0
})

// Carregar dados do dashboard quando o componente for montado
onMounted(async () => {
  try {
    if (!dashboardStore.resumo || Object.keys(dashboardStore.resumo).length === 0) {
      await dashboardStore.fetchDashboardData()
    }
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  }
})
</script>
