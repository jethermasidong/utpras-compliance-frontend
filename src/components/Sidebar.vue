<template>
  <aside class="w-63 h-201 bg-blue-900 mx-1 text-white mt-19 flex flex-col fixed left-0 top-0 border border-black rounded-md">
    <div class="p-6 text-center border-b border-swhite">
      <h1 class="text-xl font-bold tracking-wider">UTPRAS</h1>
      <p class="text-xs text-slate-400 mt-1">Regional Dashboard</p>
    </div>

    <nav class="flex-1 mt-6 px-4 space-y-2">
      <router-link 
        v-for="item in menuItems" 
        :key="item.name" 
        :to="item.path"
        class="flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-[#8ED1FC]"
      >
        <ion-icon :name="item.icon" class="mr-3 text-lg"></ion-icon>
        {{ item.name }}
      </router-link>
    </nav>

    <div class="p-3 border-t border-white mt-98">
      <button @click="handleLogout" class="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-900/30 rounded-lg transition">
        <LogOut class="mr-3" :size="20" /> Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const menuItems = [
  { name: 'Dashboard', path: '/regional-dashboard', icon: 'home-outline' },
  { name: 'Manage Programs', path: '/programs', icon: 'albums-outline' },
  { name: 'Compliance Reports', path: '/reports', icon: 'document-outline' },
  { name: 'Settings', path: '/settings', icon: 'settings-outline' },
];

const handleLogout = () => {
  localStorage.clear();
  router.push('/');
};
</script>