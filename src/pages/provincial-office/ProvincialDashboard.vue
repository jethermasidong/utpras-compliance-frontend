<template>
  <div class="p-6 md:p-10 max-w-8xl mx-auto">
    <ProvincialSidebar class="hidden md:block" /> 
    
    <div class="mb-8 flex flex-row border-b border-gray-400">
      <div class="text-2xl mr-4 border-2 rounded-full px-3 pt-3 h-13 object-cover ring-3 ring-blue-500 ring-offset-2">
        <ion-icon name="business-outline"></ion-icon>
      </div>
      <div class="flex flex-col mb-5">
        <h1 class="text-3xl font-extrabold text-gray-900">PO Dashboard</h1>
        <p class="text-gray-500 font-light">View and manage applicants program applications</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div class="flex flex-row">
          <div class="text-2xl mr-5 border border-gray-200 bg-gray-100 rounded-md px-3 pt-3 object-cover ring-2 ring-blue-500 ring-offset-2">
            <ion-icon name="documents-outline"></ion-icon>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Province Records</p>
            <h3 class="text-2xl font-black text-gray-900 mt-1">{{ applications.length }}</h3>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
         <div class="flex flex-row">
          <div class="text-2xl mr-5 border border-gray-200 bg-gray-100 rounded-md px-3 pt-3 object-cover ring-2 ring-orange-400 ring-offset-2">
            <ion-icon name="hourglass-outline"></ion-icon>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending RO Review</p>
            <h3 class="text-2xl font-black text-orange-600 mt-1">{{ pendingCount }}</h3>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div class="flex flex-row">
          <div class="text-2xl mr-5 border border-gray-200 bg-gray-100 rounded-md px-3 pt-3 object-cover ring-2 ring-green-500 ring-offset-2">
            <ion-icon name="checkmark-done-circle-outline"></ion-icon>
          </div>
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Approved / CTPR Issued</p>
            <h3 class="text-2xl font-black text-green-700 mt-1">{{ approvedCount }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-8">
      <div class="flex flex-row gap-4 overflow-x-auto pb-2">
        <button 
          v-for="program in programs" :key="program.id"
          @click="selectProgram(program)"
          :class="[
              'px-5 py-2 font-bold rounded-xl transition-all duration-200 border-2 whitespace-nowrap text-xs',
              activeProgram?.id === program.id 
              ? 'bg-blue-900 text-white border-blue-900 shadow-md shadow-blue-200' 
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
          ]"
        >
          {{ program.program_name }}
          <span :class="[
            'px-2 py-0.5 rounded-full text-[10px]',
            activeProgram?.id === program.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-gray-500'
          ]">
            {{ getProgramAppCount(program.id) }}
          </span>
        </button>
      </div>
      
      <router-link to="/program-application" class="shrink-0 ml-4">
        <button class="px-5 py-3 font-bold rounded-xl transition-all duration-200 border-2 hover:border-blue-300 bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-200 text-xs">
          + Create Application
        </button>
      </router-link>
    </div>

    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 class="text-sm font-bold text-black uppercase tracking-widest">
              {{ activeProgram ? activeProgram.program_name : 'Select a program' }} Applications
            </h2>
            <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
              {{ filteredApplications.length }} Records Found
            </span>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-50/50 text-[10px] uppercase text-gray-900">
                    <th class="px-4 py-4 min-w-37.5">{{ currentConfig.col1Header }}</th>
                    <th class="px-4 py-4 min-w-32.5">{{ currentConfig.col2Header }}</th>
                    <th class="px-4 py-4 min-w-37.5">Date Issued</th>
                    <th class="px-4 py-4 min-w-32.5">CTPR Number</th>
                    <th class="px-4 py-4 min-w-40">CTPR Link</th>
                    <th class="px-4 py-4 min-w-25">Status</th>
                    <th class="px-4 py-4 min-w-32.5">Date Created</th>
                    <th class="px-4 py-4 text-right min-w-35">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 align-middle">
                <tr v-for="app in filteredApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
                
                <td class="px-4 py-4 text-sm font-medium text-gray-800">
                    {{ app[currentConfig.col1Key] || 'N/A' }}
                </td>
                
                <td class="px-3 py-4 text-sm text-gray-600">
                    {{ app[currentConfig.col2Key] || 'N/A' }}
                </td>
                
                <td class="px-4 py-4 text-sm">
                    <input 
                        type="date" 
                        v-model="app.date_issued" 
                        class="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:bg-white outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </td>

                <td class="px-4 py-4 text-sm">
                    <input 
                        type="text" 
                        v-model="app.ctpr_number" 
                        placeholder="Enter CTPR #"
                        class="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:bg-white outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </td>

                <td class="px-4 py-4 text-sm">
                    <input 
                        type="text" 
                        v-model="app.ctpr_link" 
                        placeholder="Enter Link"
                        class="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:bg-white outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </td>

                <td class="px-3 py-4 text-left">
                  <span :class="{
                    'text-green-700 bg-green-50': app.status === 'complete and successful',
                    'text-green-400 bg-green-50': app.status === 'complete with findings',
                    'text-orange-600 bg-orange-50': app.status === 'incomplete with findings',
                    'text-red-700 bg-red-50': app.status === 'incomplete and unsuccessful',
                    'text-gray-500 bg-gray-50': !app.status || app.status === 'pending'
                  }" 
                    class="text-[10px] font-bold px-2 py-1 rounded-xl uppercase"
                  >
                      {{ app.status || 'Pending Review' }}
                  </span>
                </td>

                <td class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {{ formatDate(app.created_at) }}
                </td>
                
                <td class="px-4 py-4 text-right whitespace-nowrap space-x-1">
                    <button 
                      @click="updateApplication(app)"
                      class="font-bold text-xs border-2 hover:border-blue-300 hover:bg-blue-100 bg-white text-black border-gray-200 px-3 py-2 rounded-xl transition-colors"
                    >
                      Save
                    </button>
                    <button 
                      @click="goToCompliance(app.id, app.program_id)"
                      class="font-bold border-2 hover:border-blue-300 text-xs bg-white text-black border-gray-200 px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      View
                    </button>
                </td>

                </tr>
                <tr v-if="filteredApplications.length === 0">
                  <td colspan="8" class="text-center py-8 text-gray-400 text-xs uppercase tracking-wider">
                    No applications found for this program.
                  </td>
                </tr>
            </tbody>
            </table>
        </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '../../../composables/useToast.js';
import { viewPrograms } from '../../api/programApi.js';
import { editApplications, viewApplicationsByUser } from '../../api/applicationApi.js';
import ProvincialSidebar from '../../components/ProvincialSidebar.vue';

const router = useRouter();
const { showToast } = useToast();
const programs = ref([]);
const applications = ref([]);
const activeProgram = ref(null);

const programConfigs = {
    ebet: {
        col1Header: 'Enterprise Name',
        col1Key: 'enterprise_name',
        col2Header: 'Program Title',
        col2Key: 'program_title',
        route: '/ebet-compliance-page'
    },
    mtp: {
        col1Header: 'Institution Name', 
        col1Key: 'mtp_applicant_name',
        col2Header: 'Program Applied',
        col2Key: 'mtp_program_applied',
        route: '/mtp-compliance-page'
    },
    mcc: {
        col1Header: 'Institution Name', 
        col1Key: 'mcc_applicant_name',
        col2Header: 'Program Applied',
        col2Key: 'mcc_program_applied',
        route: '/mcc-compliance-page'
    },
    default: { 
        col1Header: 'Applicant Name',
        col1Key: 'applicant_name',
        col2Header: 'Program Applied',
        col2Key: 'program_applied',
        route: '/compliance-page'
    }
};

const currentConfig = computed(() => {
    const name = (activeProgram.value?.program_name || '').toLowerCase();
    if (name.includes('ebet')) return programConfigs.ebet;
    if (name.includes('mtp')) return programConfigs.mtp;
    if (name.includes('mcc')) return programConfigs.mcc;
    return programConfigs.default;
});

const fetchApplications = async () => {
    try {
        const rawApps = await viewApplicationsByUser();
        applications.value = rawApps.map(app => ({
             ...app,
             date_issued: app.date_issued ? app.date_issued.split('T')[0] : ''
        }));
    } catch (error) {
        console.error("Failed to load applications:", error);
        showToast('error', 'Error', 'Could not load current data.');
    }
};

onMounted(async () => {
    try {
        programs.value = await viewPrograms();
        if (programs.value.length > 0) {
            activeProgram.value = programs.value[0];
        }
        await fetchApplications();
    } catch (error) {
        console.error("Initialization error:", error);
    }
});

const updateApplication = async (app) => {
    showToast('info', 'Saving....', 'Saving application info.....');
    try {
        const data = {
            date_issued: app.date_issued ? app.date_issued : null,
            ctpr_number: app.ctpr_number || '',
            ctpr_link: app.ctpr_link || '',
        };

        await editApplications(app.id, data);
        showToast('success', 'Saved', 'Application CTPR details updated successfully.');
        await fetchApplications();
    } catch (error) {
        showToast('error', 'Error', 'Could not save current data.');
    }
};

const selectProgram = (program) => {
  activeProgram.value = program;
};

const filteredApplications = computed(() => {
  if (!activeProgram.value) return [];
  return applications.value.filter(app => app.program_id === activeProgram.value.id);
});

const pendingCount = computed(() => {
    return applications.value.filter(app => !app.status || app.status === 'pending').length;
});

const approvedCount = computed(() => {
    return applications.value.filter(app => app.status === 'complete and successful').length;
});

const getProgramAppCount = (programId) => {
  return applications.value.filter(app => app.program_id === programId).length;
};

const goToCompliance = (id, program_id) => {
  router.push({ 
      path: currentConfig.value.route, 
      query: { applicationId: id, programId: program_id } 
  });
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};
</script>