<template>
  <aside class="w-63 h-201 bg-blue-900 mx-1 text-white mt-19 flex flex-col fixed left-0 top-0 border border-black rounded-md">
    <div class="px-6 py-7 text-center border-b border-white/10">
      <h1 class="text-lg font-semibold tracking-wide">UTPRAS</h1>
      <p class="text-xs text-blue-300/70 mt-1">Regional Dashboard</p>
    </div>

    <nav class="flex-1 mt-6 px-3 space-y-1">
      <router-link 
        v-for="item in menuItems" 
        :key="item.name" 
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-blue-100/80 transition-colors hover:bg-white/10 hover:text-white"
        active-class="bg-white/10 text-white"
      >
        <ion-icon :name="item.icon" class="text-base"></ion-icon>
        {{ item.name }}
      </router-link>
    </nav>

    <div class="p-3 border-t border-white/10 mt-98">
      <button @click="handleLogout" class="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium text-red-300 hover:bg-red-900/30 hover:text-red-200 rounded-md transition-colors">
        <LogOut :size="18" /> Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const menuItems = [
  { name: 'Dashboard', path: '/regional-dashboard', icon: 'home-outline' },
  { name: 'Manage Programs', path: '/program-management', icon: 'albums-outline' },
  { name: 'Applications', path: '/reports', icon: 'document-outline' },
  { name: 'User Management', path: '/user-management', icon: 'people-outline' },
];

const handleLogout = () => {
  localStorage.clear();
  router.push('/');
};
</script>