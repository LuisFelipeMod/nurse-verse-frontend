<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
          Dashboard
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Bem-vinda de volta, Giovanna! Aqui está um resumo dos seus documentos.
        </p>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <RouterLink
          to="/upload"
          class="btn btn-primary flex"
        >
          <CloudArrowUpIcon class="h-5 w-5 mr-2" />
          Novo Documento
        </RouterLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="card hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateToSection(stat.link)"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <component
              :is="stat.icon"
              :class="['h-8 w-8', stat.iconColor]"
            />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ stat.name }}
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900">
                  {{ stat.value }}
                </div>
                <div
                  v-if="stat.change"
                  :class="[
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                    'ml-2 flex items-baseline text-sm font-semibold'
                  ]"
                >
                  <component
                    :is="stat.changeType === 'increase' ? ArrowUpIcon : ArrowDownIcon"
                    class="h-4 w-4 flex-shrink-0 self-center"
                  />
                  {{ stat.change }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Recent Documents -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Documentos Recentes</h3>
          <RouterLink
            to="/protocolos"
            class="text-sm text-primary-600 hover:text-primary-500"
          >
            Ver todos
          </RouterLink>
        </div>
        
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
        
        <div v-else-if="recentes.length === 0" class="text-center py-8 text-gray-500">
          Nenhum documento encontrado
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="doc in recentes"
            :key="doc._id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  getDocumentTypeColor(doc.tipo)
                ]"
              >
                <component
                  :is="getDocumentTypeIcon(doc.tipo)"
                  class="h-4 w-4 text-white"
                />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ doc.titulo }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(doc.createdAt) }} • {{ doc.categoria }}
                </p>
              </div>
            </div>
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusColor(doc.status)
              ]"
            >
              {{ getStatusText(doc.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Categories Chart -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Categorias Populares</h3>
        
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
        
        <div v-else-if="categorias.length === 0" class="text-center py-8 text-gray-500">
          Nenhuma categoria encontrada
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="categoria in categorias.slice(0, 6)"
            :key="categoria._id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 rounded-full bg-nurse-600"></div>
              <span class="text-sm text-gray-900">{{ categoria._id }}</span>
            </div>
            <span class="text-sm font-medium text-gray-600">
              {{ categoria.count }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="action in quickActions"
          :key="action.name"
          :to="action.href"
          class="flex items-center p-4 rounded-lg border border-gray-200 hover:border-nurse-300 hover:bg-nurse-50 transition-colors group"
        >
          <component
            :is="action.icon"
            class="h-6 w-6 text-gray-400 group-hover:text-nurse-600 mr-3"
          />
          <div>
            <p class="text-sm font-medium text-gray-900 group-hover:text-nurse-600">
              {{ action.name }}
            </p>
            <p class="text-xs text-gray-500">{{ action.description }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  MapIcon,
  PencilSquareIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import { useDashboardStore } from '@/stores/dashboard'

const router = useRouter()
const dashboardStore = useDashboardStore()

const loading = computed(() => dashboardStore.loading)
const recentes = computed(() => dashboardStore.recentes)
const categorias = computed(() => dashboardStore.categorias)
const resumo = computed(() => dashboardStore.resumo)

const stats = computed(() => [
  {
    name: 'Total de Documentos',
    value: resumo.value.totalDocumentos || 0,
    icon: DocumentTextIcon,
    iconColor: 'text-primary-600',
    link: '/protocolos',
    change: '+12%',
    changeType: 'increase'
  },
  {
    name: 'Protocolos',
    value: resumo.value.totalProtocolos || 0,
    icon: DocumentTextIcon,
    iconColor: 'text-green-600',
    link: '/protocolos'
  },
  {
    name: 'Roteiros',
    value: resumo.value.totalRoteiros || 0,
    icon: MapIcon,
    iconColor: 'text-blue-600',
    link: '/roteiros'
  },
  {
    name: 'Anotações',
    value: resumo.value.totalAnotacoes || 0,
    icon: PencilSquareIcon,
    iconColor: 'text-nurse-600',
    link: '/anotacoes'
  }
])

const quickActions = [
  {
    name: 'Novo Protocolo',
    description: 'Criar protocolo',
    icon: DocumentTextIcon,
    href: '/protocolos?novo=true'
  },
  {
    name: 'Novo Roteiro',
    description: 'Criar roteiro',
    icon: MapIcon,
    href: '/roteiros?novo=true'
  },
  {
    name: 'Upload Documento',
    description: 'Converter arquivo',
    icon: CloudArrowUpIcon,
    href: '/upload'
  },
  {
    name: 'Nova Anotação',
    description: 'Fazer anotação',
    icon: PlusIcon,
    href: '/anotacoes?novo=true'
  }
]

onMounted(async () => {
  try {
    await dashboardStore.fetchDashboardData()
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  }
})

function navigateToSection(link) {
  if (link) {
    router.push(link)
  }
}

function getDocumentTypeIcon(tipo) {
  const icons = {
    protocolo: DocumentTextIcon,
    roteiro: MapIcon,
    anotacao: PencilSquareIcon
  }
  return icons[tipo] || DocumentTextIcon
}

function getDocumentTypeColor(tipo) {
  const colors = {
    protocolo: 'bg-green-600',
    roteiro: 'bg-nurse-600',
    anotacao: 'bg-nurse-600'
  }
  return colors[tipo] || 'bg-gray-600'
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
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
