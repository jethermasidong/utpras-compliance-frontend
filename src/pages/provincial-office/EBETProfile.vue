<template>
  <div class="p-6 md:p-10 max-w-7xl mx-auto">
    <ProvincialSidebar class="hidden md:block" />
    
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900">EBET Application</h1>
      <p class="text-gray-500 mt-2">Complete your profile information below</p>
    </div>

    <div class="space-y-8">
      
      <section class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <span class="bg-blue-100 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
          Profile Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pb-5">
        <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
            {{ fieldLabels['program_type'] }}
            </label>
            <select 
            v-model="form.program_type"
            class="w-full bg-gray-50 border border-gray-200 text-gray-800 text-md rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
            >
            <option disabled value="">Select {{ fieldLabels['program_type'].toLowerCase() }}</option>
            <option value="general ebet">General EBET</option>
            <option value="apprenticeship">Apprenticeship</option>
            <option value="upskilling">Upskilling</option>
            </select>
        </div>
          <div v-for="key in inputFields" :key="key" class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              {{ fieldLabels[key] }}
            </label>
            <input 
              :required="['program_title', 'enterprise_name'].includes(key)"
              v-model="form[key]" 
              :type="isNumber(key) ? 'number' : 'text'"
              class="w-full bg-gray-50 border border-gray-200 text-gray-800 text-md rounded-xl p-3 
                     focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              :placeholder="'Enter ' + fieldLabels[key].toLowerCase()"
            />
          </div>
        </div>  
      </section>

      <div class="flex justify-end mb-10">
        <button @click="addEBETApplication" class="px-5 py-3 bg-blue-900 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-800 transition-all transform hover:-translate-y-1">
          Submit Application
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import ProvincialSidebar from '../../components/ProvincialSidebar.vue';
import { createEBETProfile } from '../../api/ebetProfile.js';
import { deleteApplication } from '../../api/applicationApi.js';
import { useToast } from '../../../composables/useToast.js';

const { showToast } = useToast();
const route = useRoute();
const router = useRouter();

const appId = ref(route.query.applicationId);
const isSubmitted = ref(false); 

const inputFields = [
    'program_title',
    'nominal_duration',
    'enterprise_name',
    'total_employees',
    'training_site',
    'street_address',
    'barangay',
    'city',
    'province',
    'zipcode',
    'website',
    'telephone',
    'mobile_no'
];

const fieldLabels = {
    program_type: 'EBET Programs',
    program_title: 'Program Title',
    nominal_duration: 'Nominal Duration (No. of Hours, Months/Years)',
    enterprise_name: 'Name of Enterprise',
    total_employees: 'Total Number of Employees',
    training_site: 'Training Site/Venue Address',
    street_address: 'Street Address',
    barangay: 'Barangay',
    city: 'City',
    province: 'Province',
    zipcode: 'Area Zip Code',
    website: 'Website (if any)',
    telephone: 'Telephone (Landline no.)',
    mobile_no: 'Mobile No.'
};

const isNumber = (key) => ['nominal_duration', 'total_employees', 'zipcode', 'telephone', 'mobile_no'].includes(key);

const form = ref({
  program_type: '', program_title: '', nominal_duration: '', enterprise_name: '', total_employees: '', 
  training_site: '', street_address: '', barangay: '', city: '', province: '', zipcode: '', website: '',
  telephone: '', mobile_no: ''
});


onBeforeRouteLeave(async (to, from, next) => {
    if (isSubmitted.value) {
        next();
    } else {
        const answer = window.confirm('You have an application in progress. If you leave, this application will be discarded. Continue?');
        if (answer) {
            try {
                await deleteApplication(appId.value);
                next();
            } catch (err) {
                console.error("Failed to delete application", err);
                next();
            }
        } else {
            next(false);
        }
    }
});



const addEBETApplication = async () => {
    console.log("Current App ID value:", appId.value);

    if (!appId.value) {
        alert("Error: Application ID is missing from the URL!");
        return;
    }
  try { 

    const sanitizedForm = Object.fromEntries(
        Object.entries(form.value).map(([key, value]) => [key, value === '' ? null : value])
    );

    const data = {
        ...sanitizedForm,
        application_id: appId.value
    };
    const response = await createEBETProfile(data);
    showToast('success', 'Application Submitted', 'Your profile has been saved successfully!');
    isSubmitted.value = true;
    form.value = {
        program_type: '', program_title: '', nominal_duration: '', enterprise_name: '', total_employees: '', 
        training_site: '', street_address: '', barangay: '', city: '', province: '', zipcode: '', website: '',
        telephone: '', mobile_no: ''
    };
    router.push('/compliance-dashboard');
  } catch (error) {
    showToast('error', 'Submission Failed', 'Something went wrong, please try again.');
    console.error(`Failed to save profile of application ${appId.value}`, error);
  }
};
</script>