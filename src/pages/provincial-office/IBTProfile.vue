<template>
  <div class="p-8 max-w-5xl mx-auto min-h-auto">
    <ProvincialSidebar class="hidden md:block" />
    
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900">IBT Application</h1>
      <p class="text-gray-500 mt-2">Complete your profile information below</p>
    </div>

    <div class="space-y-8">
      
      <section class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <span class="bg-blue-100 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
          Profile Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pb-5">
          <div v-for="key in inputFields" :key="key" class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              {{ fieldLabels[key] }}
            </label>
            <input 
              v-model="form[key]" 
              :type="isNumber(key) ? 'number' : 'text'"
              class="w-full bg-gray-50 border border-gray-200 text-gray-800 text-md rounded-xl p-3 
                     focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              :placeholder="'Enter ' + fieldLabels[key].toLowerCase()"
            />
          </div>
        </div>
      </section>

      <div class="flex justify-end -mb-5">
        <button @click="addIBTApplication" class="px-5 py-3 bg-blue-900 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-800 transition-all transform hover:-translate-y-1">
          Submit Application
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ProvincialSidebar from '../../components/ProvincialSidebar.vue';
import { createIBTProfile } from '../../api/ibtProfileApi.js';
import { useToast } from '../../../composables/useToast.js';

const { showToast } = useToast();

const route = useRoute();


const appId = ref(route.query.applicationId);

const inputFields = [
  'applicant_name', 
  'telephone', 
  'address', 
  'duration', 
  'program_applied', 
  'no_of_trainees', 
  'training_capacity', 
  'no_of_batches'
];

const fieldLabels = {
    applicant_name: 'Name of the Applicant Institution',
    telephone: 'Tel/Fax No',
    address: 'Address',
    duration: 'Duration (in Hrs.)',
    program_applied: 'Program Applied',
    no_of_trainees: 'No of trainees per batch',
    training_capacity: 'Training Capacity',
    no_of_batches: 'No of batches per year'
};

const isNumber = (key) => ['telephone', 'duration', 'no_of_trainees', 'training_capacity', 'no_of_batches'].includes(key);

const form = ref({
  applicant_name: '', telephone: '', address: '', 
  duration: '', program_applied: '', no_of_trainees: '', training_capacity: '', no_of_batches: ''
});

const addIBTApplication = async () => {
    console.log("Current App ID value:", appId.value);

    if (!appId.value) {
        alert("Error: Application ID is missing from the URL!");
        return;
    }
  try { 

    const data = {
        ...form.value,
        application_id: appId.value
    };
    const response = await createIBTProfile(data);
    showToast('success', 'Application Submitted', 'Your profile has been saved successfully!');

    form.value = {
        applicant_name: '',
        telephone: '',
        address: '',
        duration: '',
        program_applied: '',
        no_of_trainees: '',
        training_capacity: '',
        no_of_batches: ''
    };
  } catch (error) {
    showToast('error', 'Submission Failed', 'Something went wrong, please try again.');
    console.error(`Failed to save profile of application ${appId.value}`, error);
  }
};
</script>