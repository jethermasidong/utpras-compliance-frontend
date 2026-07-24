<template>
  <div class="p-6 md:p-10 max-w-8xl mx-auto">
    <ProvincialSidebar class="hidden md:block" /> 
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Provincial Office Compliance Dashboard</h1>
      <p class="text-gray-500 font-extralight">View pending applications based on programs</p>
    </div>


    <div class="flex justify-between items-center mb-8">
  
    <div class="flex gap-4 overflow-x-auto pb-2">
        <button 
        v-for="program in programs" :key="program.id"
        @click="selectProgram(program)"
        :class="[
            'px-5 py-2 font-bold rounded-xl transition-all duration-200 border-2 whitespace-nowrap',
            activeProgram?.id === program.id 
            ? 'bg-blue-900 text-white border-blue-900 shadow-md shadow-blue-200' 
            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
        ]"
        >
        {{ program.program_name }}
        </button>
    </div>
    <router-link to="/program-application" class="shrink-0 ml-4">
        <button class="px-5 py-2 font-bold rounded-xl transition-all duration-200 border-2 hover:border-blue-300 bg-white text-black border-gray-200 shadow-md shadow-blue-200">
        Create Application
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
                    <th class="px-4 py-4 min-w-37.5">Applicant Name</th>
                    <th class="px-4 py-4 min-w-32.5">Program Applied</th>
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
                    {{ app.applicant_name }}
                </td>
                
                <td class="px-3 py-4 text-sm text-gray-600">
                    {{ app.program_applied }}
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

                <td class="px-3 py-4">
                  <span :class="app.status === 'approved' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'"
                        class="text-[10px] font-bold px-2 py-1 rounded-xl uppercase">
                    {{ app.status || 'pending' }}
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
import { viewIBTProfileByApplicationID } from '../../api/ibtProfileApi.js';
import ProvincialSidebar from '../../components/ProvincialSidebar.vue';

const router = useRouter();
const { showToast } = useToast();
const programs = ref([]);
const applications = ref([]);
const activeProgram = ref(null);

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
}



const selectProgram = (program) => {
  activeProgram.value = program;
};

const filteredApplications = computed(() => {
  if (!activeProgram.value) return [];
  return applications.value.filter(app => app.program_id === activeProgram.value.id);
});

const goToCompliance = (id, program_id) => {
  router.push({ path: '/compliance-page', query: { applicationId: id,
    programId: program_id
   } });
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