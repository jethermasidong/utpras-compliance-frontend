<template>
  <div class="p-6 md:p-10 max-w-8xl mx-auto">

    <RegionalSidebar class="hidden md:block" /> 
    
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Regional Office Compliance Dashboard</h1>
      <p class="text-gray-500 font-extralight">Monitor, review, and evaluate provincial training applications</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Applications</p>
          <h3 class="text-2xl font-black text-gray-900 mt-1">{{ allApplications.length }}</h3>
        </div>
        <div class="text-2xl px-3 pt-2 pb-1 border border-gray-200 rounded-md">
          <ion-icon name="documents-outline"></ion-icon>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Reviews</p>
          <h3 class="text-2xl font-black text-orange-600 mt-1">{{ pendingCount }}</h3>
        </div>
        <div class="text-2xl px-3 pt-2 pb-1 border border-gray-200 rounded-md">
          <ion-icon name="hourglass-outline"></ion-icon>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed / Approved</p>
          <h3 class="text-2xl font-black text-green-700 mt-1">{{ approvedCount }}</h3>
        </div>
        <div class="text-2xl px-3 pt-2 pb-1 border border-gray-200 rounded-md">
          <ion-icon name="checkmark-done-circle-outline"></ion-icon>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div class="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto">
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
        </button>
      </div>

      <div class="w-full md:w-64">
        <select 
          v-model="selectedProvince"
          class="w-full bg-white border border-gray-200 text-gray-800 text-xs rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer font-medium"
        >
          <option value="">All Provinces</option>
          <option v-for="prov in uniqueProvinces" :key="prov" :value="prov">{{ prov }}</option>
        </select>
      </div>
    </div>

    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 class="text-sm font-bold text-black uppercase tracking-widest">
            {{ activeProgram ? activeProgram.program_name : 'Select a program' }} Evaluation List
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
                  <th class="px-4 py-4 min-w-30">Province</th>
                  <th class="px-4 py-4 min-w-30">Status</th>
                  <th class="px-4 py-4 min-w-32.5">Date Submitted</th>
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

                <td class="px-4 py-4 text-xs font-semibold text-gray-600">
                    {{ app.province || 'N/A' }}
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

                <td class="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {{ formatDate(app.created_at) }}
                </td>
                
                <td class="px-4 py-4 text-right whitespace-nowrap space-x-1">
                    <button 
                      @click="goToEvaluation(app.id, app.program_id)"
                      class="font-bold border-2 hover:border-blue-300 text-xs bg-white text-blue-900 border-gray-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      Evaluate / Review
                    </button>
                </td>

              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-400 text-xs uppercase tracking-wider">
                  No records found for this filter.
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
import { viewAllApplications } from '../../api/applicationApi.js'; 
import RegionalSidebar from '../../components/RegionalSidebar.vue';

const router = useRouter();
const { showToast } = useToast();
const programs = ref([]);
const allApplications = ref([]);
const activeProgram = ref(null);
const selectedProvince = ref('');

const programConfigs = {
    ebet: {
        col1Header: 'Enterprise Name',
        col1Key: 'enterprise_name',
        col2Header: 'Program Title',
        col2Key: 'program_title',
        route: '/ro-ebet-application-page'
    },
    mtp: {
        col1Header: 'Institution Name', 
        col1Key: 'applicant_name',
        col2Header: 'Program Applied',
        col2Key: 'program_applied',
        route: '/ro-mtp-application-page'
    },
    mcc: {
        col1Header: 'Institution Name', 
        col1Key: 'mcc_applicant_name',
        col2Header: 'Program Applied',
        col2Key: 'mcc_program_applied',
        route: '/ro-mcc-application-page'
    },
    default: { 
        col1Header: 'Applicant Name',
        col1Key: 'applicant_name',
        col2Header: 'Program Applied',
        col2Key: 'program_applied',
        route: '/ro-application-page' 
    }
};

const currentConfig = computed(() => {
    const name = (activeProgram.value?.program_name || '').toLowerCase();
    if (name.includes('ebet')) return programConfigs.ebet;
    if (name.includes('mtp')) return programConfigs.mtp;
    if (name.includes('mcc')) return programConfigs.mcc;
    return programConfigs.default;
});

const fetchAllApplications = async () => {
    try {
        const rawApps = await viewAllApplications();
        allApplications.value = rawApps.map(app => ({
             ...app,
             date_issued: app.date_issued ? app.date_issued.split('T')[0] : ''
        }));
    } catch (error) {
        console.error("Failed to load regional applications:", error);
        showToast('error', 'Error', 'Could not load regional compliance data.');
    }
};

onMounted(async () => {
    try {
        programs.value = await viewPrograms();
        if (programs.value.length > 0) {
            activeProgram.value = programs.value[0];
        }
        await fetchAllApplications();
    } catch (error) {
        console.error("Initialization error:", error);
    }
});

const selectProgram = (program) => {
  activeProgram.value = program;
};

const uniqueProvinces = computed(() => {
    const provinces = allApplications.value.map(app => app.province).filter(Boolean);
    return [...new Set(provinces)];
});

const filteredApplications = computed(() => {
    if (!activeProgram.value) return [];
    return allApplications.value.filter(app => {
        const matchProgram = app.program_id === activeProgram.value.id;
        const matchProvince = selectedProvince.value ? app.province === selectedProvince.value : true;
        return matchProgram && matchProvince;
    });
});

const pendingCount = computed(() => {
    return allApplications.value.filter(app => !app.status || app.status === 'pending').length;
});

const approvedCount = computed(() => {
    return allApplications.value.filter(app => app.status === 'complete and successful').length;
});

const goToEvaluation = (id, program_id) => {
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