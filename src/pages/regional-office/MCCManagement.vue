<template>
  <div class="p-6">
    <RegionalSidebar class="hidden md:block" /> 
    

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">MCC Program Requirements</h1>
      <button 
        @click="showModal = true"
        class="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Add New Requirement
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-6 py-4 font-semibold text-gray-700">Title</th>
            <th class="px-6 py-4 font-semibold text-gray-700">Display Order</th>
            <th class="px-6 py-4 font-semibold text-gray-700">Description</th>
            <th class="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="requirement in requirements" :key="requirement.id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="px-6 py-4 capitalize">{{ requirement.title }}</td>
            <td class="px-6 py-4 capitalize">{{ requirement.display_order }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">
                {{ requirement.description || 'No description provided' }}
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button class="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h2 class="text-xl font-bold mb-4">Add New Requirement</h2>
        
        <form @submit.prevent="addRequirement" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input v-model="form.title" type="text" placeholder="Enter requirement title" required class="w-full mt-1 p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Display Order</label>
            <input v-model="form.display_order" type="number" placeholder="Enter display order" required class="w-full mt-1 p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <input v-model="form.description" rows="4" placeholder="Enter display order" class="w-full mt-1 p-2 border rounded-md" />
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">Save Requirement</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import RegionalSidebar from '../../components/RegionalSidebar.vue'; 
import { viewRequirement, createRequirements, editRequirements } from '../../api/ibtApi.js';

const route = useRoute();

const showModal = ref(false);
const requirements = ref([]);
const programId = route.query.programId;

const form = ref({
  program_id: programId,
  title: '',
  display_order: '',
  description: '',
});

onMounted(async () => {
    requirements.value = await viewRequirement(programId);
});

const addRequirement = async () => {
  try {
    
    const response = await createRequirements(form.value);
    console.log("Full response from server:", response);
    
    requirements.value = await viewRequirement(programId);

    form.value = { title: '', display_order: '', description: ''};
    showModal.value = false;

  } catch (error) {
    console.error('Failed to save requirement', error);
    alert("Error saving requirement:" + (error.message || "Unknown Error"));
  }
};

</script>