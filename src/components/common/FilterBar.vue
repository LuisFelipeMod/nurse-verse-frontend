<template>
  <div class="card">
    <div class="grid grid-cols-1 gap-4" :class="gridCols">
      <slot />
      
      <div v-if="showClearButton" class="flex items-end">
        <button
          @click="$emit('clear')"
          class="btn btn-secondary w-full"
        >
          <XCircleIcon class="h-4 w-4 mr-2" />
          Limpar Filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { XCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  columns: {
    type: Number,
    default: 4
  },
  showClearButton: {
    type: Boolean,
    default: true
  }
})

defineEmits(['clear'])

const gridCols = computed(() => {
  const colsMap = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3', 
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6'
  }
  return colsMap[props.columns] || 'sm:grid-cols-4'
})
</script>
