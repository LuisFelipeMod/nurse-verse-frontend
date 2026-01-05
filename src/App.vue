<template>
  <div class="min-h-screen bg-gray-50">
    <template v-if="!isLoginPage">
      <!-- Sidebar -->
      <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
      
      <!-- Main Content -->
      <div class="lg:pl-72">
        <!-- Top Header -->
        <Header @toggleSidebar="sidebarOpen = !sidebarOpen" />
        
        <!-- Page Content -->
        <main class="py-6">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RouterView />
          </div>
        </main>
      </div>
    </template>
    
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'

const route = useRoute()
const sidebarOpen = ref(false)

const isLoginPage = computed(() => route.name === 'login')
</script>
