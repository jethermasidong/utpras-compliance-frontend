<template>
  <div class="p-6 md:p-10 max-w-7xl mx-auto">
    <ProvincialSidebar class="hidden md:block w-64 shrink-0" /> 
    <main class="flex-1 px-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
      <p class="text-gray-500 text-sm">Edit your profile and manage requirements below</p>
    </div>

    <div class="flex flex-col gap-6">
      
      <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Institution Profile</h2>
          <button 
            @click="saveProfile" 
            :disabled="!hasChanged"
            :class="[
                'px-4 py-2 text-xs font-bold rounded-lg transition-colors',
                hasChanged 
                ? 'bg-blue-900 text-white hover:bg-blue-800' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
            >
            Save Changes
           </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(label, key) in fieldLabels" :key="key">
            <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">{{ label }}</label>
            <input 
              v-model="profile[key]" 
              type="text"
              class="w-full bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 rounded-lg p-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Required Documents</h2>
          <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
            {{ pendingCount }} Pending
          </span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 text-[10px] uppercase text-gray-400">
                <th class="px-6 py-4">Requirement Title</th>
                <th class="px-6 py-4">Description</th>
                <th class="px-6 py-4">Documents</th>
                <th class="px-6 py-4">Date Uploaded</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Remarks</th>
                <th class="px-6 py-4">Date Reviewed</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="req in documents" :key="req.requirement_id">
                <td class="px-6 py-4 text-sm font-medium text-gray-700">{{ req.title }}</td>
                <td class="px-6 py-4 text-xs font-medium text-gray-700">{{ req.description }}</td>
                <td class="px-6 py-4">
                  <button class="text-blue-900 font-bold text-xs bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    {{ req.file_url ? 'View' : 'Upload'}}
                  </button>
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-700">
                    <span :class="req.status === 'compliant' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'"
                        class="text-[9px] font-bold px-2 py-1 rounded-md uppercase">
                        {{ req.uploaded_at || 'not yet uploaded' }}
                    </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="req.status === 'compliant' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'"
                        class="text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    {{ req.status || 'pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-medium text-gray-700">{{ req.remarks }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from '../../../composables/useToast.js';
import { viewApplicationsByUser } from '../../api/applicationApi.js';
import { viewDocuments } from '../../api/documentApi.js';
import ProvincialSidebar from '../../components/ProvincialSidebar.vue';
import { editIBTProfile, viewIBTProfileByApplicationID } from '../../api/ibtProfileApi.js';

const route = useRoute();
const { showToast } = useToast();
const originalProfile = ref({});


const appId = route.query.applicationId;
const progId = route.query.programId;

const profile = ref({
  applicant_name: '',
  address: '',
  program_applied: '',
  training_capacity: '',
  telephone: '',
  duration: '',
  no_of_trainees: '',
  no_of_batches: ''
});

const fieldLabels = {
  applicant_name: 'Name of the Applicant Institution',
  address: 'Address',
  program_applied: 'Program Applied',
  training_capacity: 'Training Capacity',
  telephone: 'Tel/Fax No',
  duration: 'Duration (In Hrs)',
  no_of_trainees: 'No of Trainees per batch',
  no_of_batches: 'No of Batches per year',
};

const documents = ref([]);

const pendingCount = computed(() => documents.value.filter(r => !r.status || r.status === 'pending').length);

onMounted(async () => {
  if (appId) {
    const data = await viewIBTProfileByApplicationID(appId);
    const loadedData = Array.isArray(data) ? data[0] : data;
    if (loadedData) {
      profile.value = { ...loadedData };
      originalProfile.value = JSON.parse(JSON.stringify(loadedData));
    }
    console.log("Check the description here:", documents.value);
    if (progId) {
        documents.value = await viewDocuments(appId, progId);
    }
  }
});

const hasChanged = computed(() => {
    return JSON.stringify(profile.value) !== JSON.stringify(originalProfile.value);
});


const saveProfile = async () => {
  try {
    const response = await editIBTProfile(appId, profile.value);
    const refreshedData = await viewIBTProfileByApplicationID(appId);
    const loadedData = Array.isArray(refreshedData) ? refreshedData[0] : refreshedData;
    
    if (loadedData) {
        profile.value = { ...profile.value, ...loadedData };
    }
    showToast('success', 'Profile Updated', 'Your changes have been saved.');
  } catch (err) {
    showToast('error', 'Error', 'Failed to save changes.');
    console.error(err);
  }
};
</script>