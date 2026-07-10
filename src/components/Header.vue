<template>
  <header class="bg-blue-900 text-white p-4  shadow-md">
    <nav class="max-w-6xl mx-auto flex justify-between">
      <div class="flex flex-row">
        <img class="w-10 h-10" src="/tesda-logo.png" alt="Company Logo" />
        <h1 class="pl-2 mt-1 text-xl font-bold">UTPRAS Portal</h1>
      </div>
      <div class="space-x-4 m-1">
        <router-link to="/" class="hover:text-blue-200">Home</router-link>
        <router-link to="/about" class="hover:text-blue-200">About</router-link>
      </div>
    </nav>
  </header>
</template>