<template>
  <div class="min-h-screen flex flex-col">
    
    <Header />
    
    <main class="grow max-w-6xl mx-auto w-full p-6">
      <slot /> 
    </main>
    
    <Footer />
    
  </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>