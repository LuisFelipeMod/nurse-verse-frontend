<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.name"
      class="card hover:shadow-md transition-shadow cursor-pointer"
      @click="stat.onClick && stat.onClick()"
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
</template>

<script setup>
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'

defineProps({
  stats: {
    type: Array,
    required: true
  }
})
</script>
