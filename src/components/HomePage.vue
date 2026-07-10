<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold text-blue-600">UTPRAS</h1>
      <div class="space-x-4">
        <router-link to="/" class="text-gray-600 hover:text-blue-600">Home</router-link>
        <router-link to="/about" class="text-gray-600 hover:text-blue-600">About</router-link>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto mt-10 p-6 text-center">
      <h1 class="text-5xl font-extrabold text-gray-900 mb-6">
        Welcome to Compliance Portal
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Streamline your tracking and manage your requirements with ease.
      </p>
      <button 
        @click="handleAction"
        class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Get Started
      </button>
    </main>
  </div>
</template>

<script setup>
const handleAction = () => {
  alert('Redirecting to dashboard...');
};
</script>

<style scoped>
/* Optional: Add custom overrides here if Tailwind isn't enough */
</style>