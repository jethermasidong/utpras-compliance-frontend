<template>
  <div class="p-6">
    <RegionalSidebar class="hidden md:block" /> 
    
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Manage Programs</h1>
      <button 
        @click="showModal = true"
        class="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Add New Program
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <div v-for="program in programs" :key="program.id" @click="navigateToProgram(program.program_name)"
           class="bg-white border border-gray-200 p-6 rounded-xl hover:border-blue-300 transition-colors flex flex-col">
        
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-blue-900 text-lg">
            {{ program.id }}
          </div>

          <div class="flex space-x-2">
            <button class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase">Edit</button>
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

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h2 class="text-xl font-bold mb-4">Add New User</h2>
        
        <form @submit.prevent="addProgram" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Program Name</label>
            <input v-model="form.program_name" type="text" placeholder="Enter program name" required class="w-full mt-1 p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              v-model="form.description" 
              required 
              rows="4" 
              placeholder="Enter description" 
              class="w-full mt-1 p-2 border rounded-md resize-none"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">Save Program</button>
          </div>
        </form>
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

const showModal = ref(false);
const programs = ref([]);

const form = ref({
  program_name: '',
  description: '',
});

onMounted(async () => {
   programs.value = await viewPrograms();
});


const addProgram = async () => {
  console.log("Data being sent:", form.value);
  try {
    
    const response = await createProgram(form.value);
    console.log("Full response from server:", response);

    programs.value = await viewPrograms();

    form.value = { program_name: '', description: ''};
    showModal.value = false;

  } catch (error) {
    console.error('Failed to save program', error);
    alert("Error saving user:" + (error.message || "Unknown Error"));
  }
};


const navigateToProgram = (name) => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  router.push(`/${slug}-management`);
};


</script>