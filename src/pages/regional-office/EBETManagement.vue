  <template>
    <div class="p-6 md:p-10 max-w-7xl mx-auto">
      <RegionalSidebar class="hidden md:block" /> 
      

      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">EBET Program Requirements</h1>
        <button 
          @click="showRequirementModal = true"
          class="bg-blue-900 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          + Add Requirement
        </button>
      </div>
      

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
              <th class="px-4 py-4 font-semibold text-gray-700">Title</th>
              <th class="px-6 py-4 font-semibold text-gray-700">Display Order</th>
              <th class="px-6 py-4 font-semibold text-gray-700">Description</th>
              <th class="px-6 py-4 font-semibold text-gray-700">Category</th>
              <th class="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="requirement in requirements" :key="requirement.id" class="border-b border-gray-100 hover:bg-gray-50 text-sm">
              <td class="px-4 py-4 capitalize font-medium text-gray-800">{{ requirement.title }}</td>
              <td class="px-6 py-4 capitalize text-gray-600">{{ requirement.display_order }}</td>
              <td class="px-6 py-4 capitalize text-gray-600">{{ requirement.description || 'N/A' }}</td>
              <td class="px-6 py-4 capitalize text-gray-600">{{ requirement.category || 'N/A' }}</td>
              <td class="px-6 py-4 text-right space-x-2 flex flex-col gap-2">
                <button @click="openEditModal(requirement)" class="text-blue-600 hover:text-blue-800 font-medium cursor-pointer border border-gray-100 rounded-md px-2 py-1 hover:bg-blue-600/10">Edit</button>
                <button @click="confirmDelete(requirement.id)" class="text-red-600 hover:text-red-800 font-medium cursor-pointer border border-gray-100 rounded-md px-2 py-1 hover:bg-red-600/10">Delete</button>
              </td>
            </tr>
            <tr v-if="requirements.length === 0">
              <td colspan="5" class="text-center py-8 text-gray-400 text-xs">No standard requirements found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showRequirementModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="form.category" required @change="handleCategoryChange" :class="[
                    'w-full mt-1 p-2 border rounded-md outline-none transition-all bg-white cursor-pointer',
                    !form.category ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                ]">
                    <option disabled value="">Select category</option>
                    <option value="corporate and administrative documents">Corporate and Administrative Documents</option>
                    <option value="training delivery requirements">Training Delivery Requirements</option>
                    <option value="additional requirements">Additional Requirements</option>
                    <option value="hidden requirements">Hidden Requirements</option>
                </select>
                <p v-if="!form.category" class="text-[12px] text-red-500 mt-1">This field is required</p> 
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
              <button type="button" @click="showRequirementModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
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
              <input v-model="editForm.title" type="text" placeholder="Enter requirement title" required class="w-full mt-1 p-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Display Order</label>
              <input v-model="editForm.display_order" type="number" placeholder="Enter display order" required class="w-full mt-1 p-2 border border-gray-300 rounded-md" />
            </div>
           <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="editForm.category" required @change="handleCategoryChange" :class="[
                    'w-full mt-1 p-2 border rounded-md outline-none transition-all bg-white cursor-pointer',
                    !editForm.category ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                ]">
                    <option disabled value="">Select category</option>
                    <option value="corporate and administrative documents">Corporate and Administrative Documents</option>
                    <option value="training delivery requirements">Training Delivery Requirements</option>
                    <option value="additional requirements">Additional Requirements</option>
                    <option value="hidden requirements">Hidden Requirements</option>
                </select>
                <p v-if="!editForm.category" class="text-[12px] text-red-500 mt-1">This field is required</p> 
              </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                v-model="editForm.description" 
                rows="4" 
                placeholder="Enter description" 
                class="w-full mt-1 p-2 border rounded-md resize-none border-gray-300"
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

  const showRequirementModal = ref(false);
  const showEditModal = ref(false);

  const requirements = ref([]);

  const programId = route.query.programId;

  const editingId = ref(null);



  const form = ref({
    program_id: programId,
    title: '',
    display_order: '',
    description: '',
    category: '',
    is_public: 'false',
  });


  const editForm = ref({
    title: '',
    display_order: '',
    description: '',
    category: '',
    is_public: '',
  });


  onMounted(async () => {
      requirements.value = await viewRequirement(programId);
  });

  const handleCategoryChange = () => {
    if (form.value.category === 'hidden requirements') {
      form.value.is_public = false;
    } else {
      form.value.is_public = true;
    }
  }
  

  const handleEditCategoryChange = () => {
    if (editForm.value.category === 'hidden requirements') {
      editForm.value.is_public = false;
    } else {
      editForm.value.is_public = true;
    }
  }

  const openEditModal = (req) => {
    editingId.value = req.id;
    editForm.value = {
      program_id: programId,
      title: req.title,
      display_order: req.display_order,
      description: req.description,
      category: req.category,
      is_public: req.is_public
    };
    showEditModal.value = true;
  }



  const addRequirement = async () => {
    try {
      
      const response = await createRequirements(form.value);
      
      requirements.value = await viewRequirement(programId);

      form.value = { program_id: programId, title: '', display_order: '', description: '', category: ''};
      showRequirementModal.value = false;
      showToast('success', 'Requirement Added', 'Your changes have been saved.'); 
    } catch (error) {
      showToast('error', 'Error', 'Failed to save changes.');
    }
  };


  const saveRequirement = async () => {
    try {
      const response = await editRequirements(editingId.value, editForm.value);

      requirements.value = await viewRequirement(programId);
      editForm.value = { program_id: programId, title: '', display_order: '', description: '', category: ''};
      showEditModal.value = false;
      showToast('success', 'Requirement Updated', 'Your changes have been saved.');
    } catch (error) {
      showToast('error', 'Error', 'Failed to save changes.');
      
    }
  };

  const confirmDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this requirement? This action cannot be undone.')) {
      try {
        await deleteRequirement(id);
        
        requirements.value = await viewRequirement(programId);
        showToast('success', 'Deleted', 'Requirement has been successfully removed.');
      } catch (error) {
        showToast('error', 'Error', 'Failed to delete requirement.');
      }
    }
  };


  </script>