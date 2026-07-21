<template>
  <div class="p-6 md:p-10 max-w-7xl mx-auto">
    <RegionalSidebar class="hidden md:block" /> 
    

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
      <button 
        @click="showModal = true"
        class="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Add New User
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200  ">
            <th class="px-6 py-4 font-semibold text-gray-700">Role</th>
            <th class="px-6 py-4 font-semibold text-gray-700">Province</th>
            <th class="px-6 py-4 font-semibold text-gray-700">Email</th>
            <th class="px-6 py-4 font-semibold text-gray-700">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="px-6 py-4 capitalize">{{ user.role }}</td>
            <td class="px-6 py-4 capitalize">{{ user.province }}</td>
            <td class="px-6 py-4 text-gray-600">{{ user.email }}</td>
            <td class="px-6 py-4 text-gray-600">{{ formatDate(user.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h2 class="text-xl font-bold mb-4">Add New User</h2>
        
        <form @submit.prevent="createUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select v-model="form.role" required :class="[
                'w-full mt-1 p-2 border rounded-md outline-none transition-all',
                !form.role ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
              ]">
              <option value="regional">Regional</option>
              <option value="provincial">Provincial</option>
            </select>
            <p v-if="!form.role" class="text-[12px] text-red-500 mt-1">This field is required</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Province</label>
           <select v-model="form.province" required :class="[
                'w-full mt-1 p-2 border rounded-md outline-none transition-all',
                !form.province ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
              ]">
              <option value="abra">Abra</option>
              <option value="apayao">Apayao</option>
              <option value="benguet">Benguet</option>
              <option value="ifugao">Ifugao</option>
              <option value="kalinga">Kalinga</option>
              <option value="mountain province">Mountain Province</option>
            </select>
            <p v-if="!form.province" class="text-[12px] text-red-500 mt-1">This field is required</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              placeholder="Enter your email" 
              required 
              maxLength="50"
              :class="[
                'w-full mt-1 p-2 border rounded-md outline-none transition-all',
                !form.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
              ]" 
            />
            <p v-if="!form.email" class="text-[12px] text-red-500 mt-1">This field is required</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="Enter your password" 
              required 
              maxLength="50"
              :class="[
                'w-full mt-1 p-2 border rounded-md outline-none transition-all',
                !form.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'
              ]" 
            />
            <p v-if="!form.password" class="text-[12px] text-red-500 mt-1">This field is required</p>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">Save User</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from '../../../composables/useToast.js';
import RegionalSidebar from '../../components/RegionalSidebar.vue'; 
import { addUser, viewUsers } from '../../api/userApi.js';


const showModal = ref(false);
const users = ref([]);
const { showToast } = useToast();

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const form = ref({
  role: '',
  province: '',
  email: '',
  password: ''
});

onMounted(async () => {
    users.value = await viewUsers();
});

const createUser = async () => {
  try {
    
    const response = await addUser(form.value);
    console.log("Full response from server:", response);
    
    users.value = await viewUsers();

    form.value = { role: '', province: '', email: '', password: '' };
    showModal.value = false;
    showToast('success', 'User Created', 'User have been saved.');
  } catch (error) {
    showToast('error', 'Error', 'Failed to save changes.');
    console.error(err);
  }
};

</script>