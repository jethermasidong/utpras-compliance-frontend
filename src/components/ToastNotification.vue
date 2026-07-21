<template>
  <Teleport to="body">
    <div class="fixed top-25 right-5 z-9999 flex flex-col gap-3 pointer-events-none">
      <transition-group name="fade">
        <div 
          v-for="toast in toasts" :key="toast.id"
          class="pointer-events-auto bg-white border border-gray-100 shadow-2xl rounded-xl p-4 w-80 flex items-start gap-4 overflow-hidden relative"
        >
          <div :class="[
            'w-1.5 h-12 rounded-full', 
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          ]"></div>
          
          <div class="flex-1">
            <h4 class="font-bold text-gray-800">{{ toast.title }}</h4>
            <p class="text-sm text-gray-500">{{ toast.message }}</p>
          </div>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup>
import { inject } from 'vue';
const toasts = inject('toasts');
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(20px); }
</style>