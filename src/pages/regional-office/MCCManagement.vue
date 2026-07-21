  <template>
    <div class="p-6 md:p-10 max-w-7xl mx-auto">
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
              <td class="px-6 py-4 capitalize">{{ requirement.description || 'N/A' }}</td>
              <td class="px-6 py-4 text-right space-x-2">
                <button @click="openEditModal(requirement)" class="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
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
              <input v-model="form.title" type="text" placeholder="Enter requirement title" required :class="[
                  'w-full mt-1 p-2 border rounded-md outline-none transition-all',
                  !form.title ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                ]"/>
                <p v-if="!form.title" class="text-[12px] text-red-500 mt-1">This field is required</p> 
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Display Order</label>
              <input v-model="form.display_order" type="number" placeholder="Enter display order" required :class="[
                  'w-full mt-1 p-2 border rounded-md outline-none transition-all',
                  !form.display_order ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                ]"/>
                <p v-if="!form.display_order" class="text-[12px] text-red-500 mt-1">This field is required</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                v-model="form.description" 
                rows="4" 
                placeholder="Enter description" 
                class="w-full mt-1 p-2 border rounded-md resize-none"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">Save Requirement</button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
          <h2 class="text-xl font-bold mb-4">Edit Requirement</h2>
          
          <form @submit.prevent="saveRequirement" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Title</label>
              <input v-model="editForm.title" type="text" placeholder="Enter requirement title" required class="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Display Order</label>
              <input v-model="editForm.display_order" type="number" placeholder="Enter display order" required class="w-full mt-1 p-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                v-model="editForm.description" 
                rows="4" 
                placeholder="Enter description" 
                class="w-full mt-1 p-2 border rounded-md resize-none"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button type="button" @click="showEditModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
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
  import { useToast } from '../../../composables/useToast.js';
  import RegionalSidebar from '../../components/RegionalSidebar.vue'; 
  import { viewRequirement, createRequirements, editRequirements } from '../../api/ibtApi.js';

  const route = useRoute();
  const { showToast } = useToast();

  const showModal = ref(false);
  const showEditModal = ref(false);
  const requirements = ref([]);
  const programId = route.query.programId;
  const editingId = ref(null);


  const form = ref({
    program_id: programId,
    title: '',
    display_order: '',
    description: '',
  });

  const editForm = ref({
    title: '',
    display_order: '',
    description: '',
  });

  onMounted(async () => {
      requirements.value = await viewRequirement(programId);
  });


  const openEditModal = (req) => {
    editingId.value = req.id;
    editForm.value = {
      program_id: programId,
      title: req.title,
      display_order: req.display_order,
      description: req.description
    };
    showEditModal.value = true;
  }



  const addRequirement = async () => {
    try {
      
      const response = await createRequirements(form.value);
      
      requirements.value = await viewRequirement(programId);

      form.value = { program_id: programId, title: '', display_order: '', description: ''};
      showModal.value = false;
      showToast('success', 'Requirement Added', 'Your changes have been saved.'); 
    } catch (error) {
      showToast('error', 'Error', 'Failed to save changes.');
    }
  };

  const saveRequirement = async () => {
    try {
      const response = await editRequirements(editingId.value, editForm.value);

      requirements.value = await viewRequirement(programId);
      editForm.value = { program_id: programId, title: '', display_order: '', description: ''};
      showEditModal.value = false;
      showToast('success', 'Requirement Updated', 'Your changes have been saved.');
    } catch (error) {
      showToast('error', 'Error', 'Failed to save changes.');
      
    }
  }

  </script>