<template>
  <div class="min-h-screen flex flex-col">
    
    <Header />
    
    <main class="grow w-full pr-30 pl-80 py-10">
      <slot /> 
    </main>
    
    <Footer />
    
  </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>