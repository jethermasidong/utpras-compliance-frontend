<template>
  <MainLayout>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </MainLayout>
  <ToastNotification />
</template>

<script setup>
import MainLayout from './pages/MainLayout.vue';
import { provide, ref } from 'vue';
import ToastNotification from './components/ToastNotification.vue';

const toasts = ref([]);
provide('toasts', toasts);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>