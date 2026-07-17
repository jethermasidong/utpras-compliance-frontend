<template>
  <div class="p-6">
    <ProvincialSidebar class="hidden md:block" /> 
    
    <div class="flex flex-col justify-between items-right mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Program Applications</h1>
      <h1 class="text-xl text-gray-500">Choose and Apply in UTPRAS Programs</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div v-for="program in programs" :key="program.id" @click="navigateToRequirements(program)"
           class="bg-white border border-gray-200 p-6 rounded-xl hover:border-blue-300 transition-colors flex flex-col">
        
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-blue-900 text-lg">
            {{ program.id }}
          </div> 
        </div>

        <h3 class="font-bold text-gray-800 text-lg mb-1 truncate">{{ program.program_name }}</h3>
        <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ program.description }}</p>
        
        <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
           <span class="px-2 py-1 bg-green-50 text-green-700 text-[10px] uppercase font-bold rounded">Active</span>
           <span class="text-[10px] text-gray-400 font-bold uppercase">Requirements: {{ program.reqCount || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { viewPrograms } from '../../api/programApi.js';
import { add } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import ProvincialSidebar from '../../components/ProvincialSidebar.vue';
import { createIBTProfile } from '../../api/ibtProfileApi.js';
import { createApplication } from '../../api/applicationApi.js';

const router = useRouter();

const showModal = ref(false);
const programs = ref([]);

onMounted(async () => {
   programs.value = await viewPrograms();
});



const navigateToRequirements = async (program) => {
  try {

    const data = {
      program_id: program.id
    };

    const response = await createApplication(data);

    const appId = response.id || response.application_id || (response.data && response.data.id);

    if (!appId) {
        console.error("Could not find application ID in response!", response);
        alert("Error: Could not retrieve application ID.");
        return;
    }

    const routeMap = {
    'IBT': '/ibt-profile',
    'EBET': '/ebet-profile',
    'MCC': '/mcc-profile'
    }

    const path = routeMap[program.program_name] || 'default-management';

    router.push({
      path: path,
      query: {
        programId: program.id,
        applicationId: appId
      }
    });
  } catch (error) {

  }
};


</script>