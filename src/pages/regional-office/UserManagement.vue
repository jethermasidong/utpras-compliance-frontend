<template>
  <div class="p-6">
    <RegionalSidebar class="hidden md:block" /> 
    
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
      <button 
        @click="showModal = true"
        class="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Add New User
      </button>
    </div>

    <!-- User Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-6 py-4 font-semibold text-gray-700">Name</th>
            <th class="px-6 py-4 font-semibold text-gray-700">Email</th>
            <th class="px-6 py-4 font-semibold text-gray-700">Role</th>
            <th class="px-6 py-4 font-semibold text-gray-700">Province</th>
            <th class="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
            <td class="px-6 py-4">{{ user.name }}</td>
            <td class="px-6 py-4 text-gray-600">{{ user.email }}</td>
            <td class="px-6 py-4 capitalize">{{ user.role }}</td>
            <td class="px-6 py-4 capitalize">{{ user.province }}</td>
            <td class="px-6 py-4 text-right space-x-2">
              <button class="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
              <button class="text-red-600 hover:text-red-800 font-medium">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add User Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
        <h2 class="text-xl font-bold mb-4">Add New User</h2>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input v-model="form.name" type="text" required class="w-full mt-1 p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="form.email" type="email" required class="w-full mt-1 p-2 border rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select v-model="form.role" class="w-full mt-1 p-2 border rounded-md">
              <option value="regional">Regional</option>
              <option value="provincial">Provincial</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Province</label>
            <input v-model="form.province" type="text" required class="w-full mt-1 p-2 border rounded-md" />
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
import { ref } from 'vue';
import RegionalSidebar from '../../components/RegionalSidebar.vue'; // Adjust path as needed

const showModal = ref(false);

const users = ref([
  { id: 1, name: 'Juan Dela Cruz', email: 'juan@utpras.gov.ph', role: 'regional', province: 'Benguet' },
]);

const form = ref({
  name: '',
  email: '',
  role: 'regional',
  province: ''
});

const saveUser = async () => {
  try {
    // Simulate API call
    const newUser = { 
      id: Date.now(), 
      ...form.value 
    };
    
    users.value.push(newUser);
    
    // Reset and Close
    form.value = { name: '', email: '', role: 'regional', province: '' };
    showModal.value = false;
  } catch (error) {
    console.error('Failed to save user', error);
  }
};
</script>