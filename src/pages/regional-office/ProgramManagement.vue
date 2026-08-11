<template>
  <div class="p-6 md:p-10 max-w-7xl mx-auto">
    <RegionalSidebar class="hidden md:block" /> 
    
    <div class="items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Manage Programs</h1>
      <h1 class="text-md font-thin text-gray-800">Edit Program Requirements</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div v-for="program in programs" :key="program.id" @click="navigateToRequirements(program)"
           class="bg-white border border-gray-200 p-6 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-colors flex flex-col">
        
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-blue-900 text-lg">
            {{ program.id }}
          </div>

          <div class="flex space-x-2">
            <button class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase"></button>
          </div>
        </div>

        <h3 class="font-bold text-gray-800 text-lg mb-1 truncate">{{ program.program_name }}</h3>
        <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ program.description }}</p>
        
        <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
           <span class="px-2 py-1 bg-green-50 text-green-700 text-[10px] uppercase font-bold rounded">Active</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RegionalSidebar from '../../components/RegionalSidebar.vue';
import { createProgram, editProgram, viewPrograms } from '../../api/programApi.js';
import { add } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();

const programs = ref([]);

const form = ref({
  program_name: '',
  description: '',
});

onMounted(async () => {
   programs.value = await viewPrograms();
});



const navigateToRequirements = (program) => {

  const routeMap = {
    'IBT': 'ibt-management',
    'EBET': '/ebet-management',
    'MCC': '/mcc-management',
    'MTP': '/mtp-management'
  }

  const path = routeMap[program.program_name] || 'default-management';

  router.push({
    path: path,
    query: { programId: program.id}
  });
};


</script>