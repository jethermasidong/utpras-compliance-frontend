<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-blue-900 text-white p-4 shadow-md">
    <nav class="max-w-6xl mx-auto flex justify-between items-center">
      
      <div class="flex items-center">
        <img class="w-10 h-10 bg-white rounded-full p-1" src="/tesda-logo.png" alt="Company Logo" />
        <h1 class="pl-2 text-xl font-semibold flex flex-row">CAR UTPRAS</h1>
      </div>
      
      <div v-if="!route.meta.requiresAuth" class="flex items-center space-x-4">
        <router-link
          v-for="item in headerItems"
          :key="item.name"
          :to="item.path"
          class="inline-flex items-center gap-1 font-extralight text-md border border-white rounded-2xl px-4 py-1 hover:bg-white/50 transition-colors"
          active-class="bg-white text-blue-900"
        >
          <ion-icon :name="item.icon" class="text-lg mb-0.5 mr-2"></ion-icon>
          <span>{{ item.name }}</span>
        </router-link> 
      </div>
      
    </nav>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const headerItems = [
  { name: 'Home', path: '/', icon: 'home-outline'},
  { name: 'About', path: '/about', icon: 'information-circle-outline'},
];
</script>