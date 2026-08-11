<template>
  <aside class="w-63 h-210 bg-blue-900 mx-1 text-white mt-19 flex flex-col fixed left-0 top-0 border border-black rounded-md">
    <div class="flex flex-row px-6 py-7 text-center border-b border-white/10">
      <img 
        src="https://th.bing.com/th/id/R.f3e921a0737a56195a760fef1f5b319c?rik=Nmh5Z0Vuftu7zw&riu=http%3a%2f%2fcar.tesda.gov.ph%2ftesdacar%2fwp-content%2fuploads%2f2025%2f03%2fcropped-TESDA-CAR-Logo-white-Border.png&ehk=rC0BNUCp7Y%2bQQaYqg4IdGImQy0uOLE5cvklnDdA3N2Q%3d&risl=&pid=ImgRaw&r=0" 
        alt="UTPRAS Logo" 
        class="w-15 h-15 mr-3 mb-3 object-contain rounded-full bg-white px-1 py-1"
      />
      <div class="flex flex-col text-left mt-1">
        <h1 class="text-lg font-semibold tracking-wide">UTPRAS</h1>
        <p class="text-xs text-blue-300/70">Regional Dashboard</p>
      </div>
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
  { name: 'Applications', path: '/applications', icon: 'document-outline' },
  { name: 'User Management', path: '/user-management', icon: 'people-outline' },
];

const handleLogout = () => {
  localStorage.clear();
  router.push('/');
};
</script>