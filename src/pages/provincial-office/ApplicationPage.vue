<template>
  <div class="p-6 md:p-10 max-w-7xl mx-auto">
    <ProvincialSidebar class="hidden md:block" /> 
    
    <div class="flex flex-col justify-between items-right mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Program Applications</h1>
      <h1 class="text-xl text-gray-500">Choose and Apply in UTPRAS Programs</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div v-for="program in programs" :key="program.id" @click="confirmSelection(program)"
           class="cursor-pointer bg-white border border-gray-200 p-6 rounded-xl hover:border-blue-300 transition-colors flex flex-col">
        
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-blue-900 text-lg">
            {{ program.id }}
          </div> 
        </div>

        <h3 class="font-bold text-gray-800 text-lg mb-1 truncate">{{ program.program_name }}</h3>
        <p class="text-lg text-gray-500 mb-4 line-clamp-2">{{ program.description }}</p>
        
        <div class="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
           <span class="px-2 py-1 bg-green-50 text-green-700 text-[10px] uppercase font-bold rounded">Active</span>
        </div>
      </div>
    </div>
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
        <h2 class="text-lg font-bold mb-2">Apply for {{ selectedProgram?.program_name }}?</h2>
        <p class="text-gray-600 mb-6 text-sm">Are you sure you want to start a new application for this program?</p>
        
        <div class="flex justify-end space-x-3">
          <button @click="showConfirmModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button @click="handleConfirm" class="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">Yes, Proceed</button>
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
const showConfirmModal = ref(false);
const selectedProgram = ref(null);

const confirmSelection = (program) => {
  selectedProgram.value = program;
  showConfirmModal.value = true;
};

const handleConfirm = async () => {
  showConfirmModal.value = false;
  if (selectedProgram.value) {
    await navigateToRequirements(selectedProgram.value);
  }
};

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