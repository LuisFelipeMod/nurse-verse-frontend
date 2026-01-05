<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div v-if="isOpen" class="relative z-50 lg:hidden">
      <div class="fixed inset-0 bg-gray-900/80" @click="$emit('close')"></div>
      
      <div class="fixed inset-0 flex">
        <div class="relative mr-16 flex w-full max-w-xs flex-1">
          <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
            <button type="button" class="-m-2.5 p-2.5" @click="$emit('close')">
              <XMarkIcon class="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
            <SidebarContent />
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <SidebarContent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'
import SidebarContent from './SidebarContent.vue'

defineProps({
  isOpen: Boolean
})

defineEmits(['close'])
</script>
