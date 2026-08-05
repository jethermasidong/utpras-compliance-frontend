<template>
  <div class="p-6 md:p-10 max-w-8xl mx-auto">
    <RegionalSidebar class="hidden md:block" /> 
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900">Regional Office Application Management</h1>
      <p class="text-gray-500 font-extralight">View pending applications based on programs</p>
    </div>

    
    <div class="flex gap-4 overflow-x-auto pb-2 mb-4">
        <button 
        v-for="province in provinces" :key="province"
        @click="activeProvince = province "
        :class="[
            'px-5 py-2 font-bold rounded-xl transition-all duration-200 border-2 whitespace-nowrap',
            activeProvince === province 
            ? 'bg-blue-900 text-white border-blue-900 shadow-md shadow-blue-200' 
            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
        ]"
        >
        {{ province }}
        <span :class="[
            'px-2 py-0.5 rounded-full text-[10px]',
            activeProvince === province ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
        ]">
            {{ provinceCounts[province] || 0 }}
        </span>
        </button>
    </div>

    <div class="border border-t border-gray-200 mb-4">
    </div>

    <div class="flex justify-between items-center mb-8">
  
    <div class="flex gap-4 overflow-x-auto pb-2">
        <button 
        v-for="program in programs" :key="program.id"
        @click="selectProgram(program)"
        :class="[
            'px-4 py-1 font-bold rounded-xl transition-all duration-200 border-2 whitespace-nowrap',
            activeProgram?.id === program.id 
            ? 'bg-blue-900 text-white border-blue-900 shadow-md shadow-blue-200' 
            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
        ]"
        >
        {{ program.program_name }}
        </button>
    </div>
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
                        type="file" 
                        accept=".pdf,.jpg,.png"
                        :ref="el => ctprFileInputs[app.id] = el" 
                        @change="(e) => handleCTPRFileSelected(e, app)" 
                        class="hidden" 
                    />
                    <div class="flex items-center gap-2">
                        <a 
                            v-if="app.ctpr_link && app.ctpr_link.trim() !== ''"
                            :href="getFileUrl(app.ctpr_link)"
                            target="_blank"
                            class="font-bold text-xs border-2 hover:border-blue-300 hover:bg-blue-100 bg-white text-black border-gray-200 px-3 py-1.5 rounded-xl cursor-pointer transition-colors flex items-center justify-center"
                            title="View Document"
                        >
                            <ion-icon name="eye-outline" class="text-sm"></ion-icon>
                        </a>

                        <button 
                            @click="triggerCTPRFileInput(app.id)"
                            class="font-bold text-xs border-2 hover:border-blue-300 hover:bg-blue-100 bg-white text-black border-gray-200 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                        >
                            {{ app.ctpr_link ? 'Change' : 'Upload' }}
                        </button>
                    </div>
                </td>

                <td class="px-3 py-4 text-left">
                  <span :class="app.status === 'complete and successful' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'"
                        class="text-[10px] font-bold px-1 py-1 rounded-xl uppercase">
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
import { editApplications, viewAllApplications, viewApplicationsByUser } from '../../api/applicationApi.js';
import { viewIBTProfileByApplicationID } from '../../api/ibtProfileApi.js';
import ProvincialSidebar from '../../components/ProvincialSidebar.vue';
import RegionalSidebar from '../../components/RegionalSidebar.vue';

const router = useRouter();
const { showToast } = useToast();

const programs = ref([]);

const applications = ref([]);

const activeProgram = ref(null);

const ctprFileInputs = ref({});

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
        col1Key: 'mtp_applicant_name',
        col2Header: 'Program Applied',
        col2Key: 'mtp_program_applied',
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


const fetchApplications = async () => {
    try {
        const rawApps = await viewAllApplications();
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


const triggerCTPRFileInput = (appId) => {
    if (ctprFileInputs.value[appId]) {
        ctprFileInputs.value[appId].click();
    }
};

const handleCTPRFileSelected = async (event, app) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        showToast('info', 'Uploading....', 'Uploading CTPR Document...');
        
        const formData = new FormData();
        formData.append('file', file);
        
        if (app.date_issued) formData.append('date_issued', app.date_issued);
        if (app.ctpr_number) formData.append('ctpr_number', app.ctpr_number);

        await editApplications(app.id, formData);
        
        showToast('success', 'Uploaded', 'Document saved automatically!');
        await fetchApplications(); 
        
    } catch (error) {
        console.error("Upload Error:", error);
        showToast('error', 'Error', 'Failed to upload document.');
    } finally {
        event.target.value = ''; 
    }
};


const updateApplication = async (app) => {
    showToast('info', 'Saving....', 'Saving application info.....');
    try {
        const formData = new FormData();
        
        if (app.date_issued) formData.append('date_issued', app.date_issued);
        if (app.ctpr_number) formData.append('ctpr_number', app.ctpr_number);
        if (app.ctpr_link) formData.append('ctpr_link', app.ctpr_link);

        await editApplications(app.id, formData);
        
        showToast('success', 'Saved', 'Application details updated successfully.');
        await fetchApplications();
    } catch (error) {
        showToast('error', 'Error', 'Could not save current data.');
    }
}



const selectProgram = (program) => {
  activeProgram.value = program;
};

const activeProvince = ref('All');
const provinces = ref(['All', 'Benguet', 'Mountain Province', 'Ifugao', 'Abra', 'Kalinga', 'Apayao']);

const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const matchesProgram = activeProgram.value ? String(app.program_id) === String(activeProgram.value.id) : true;
    
    if (activeProvince.value === 'All') {
      return matchesProgram;
    }

    const appProvince = (app.province || '').trim().toLowerCase();
    const selectedProvince = activeProvince.value.trim().toLowerCase();
    
    return matchesProgram && (appProvince === selectedProvince);
  });
});

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

const getFileUrl = (url) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://localhost:3000${url.startsWith('/') ? '' : '/'}${url}`;
};


const provinceCounts = computed(() => {
    const counts = {};
    provinces.value.forEach(p => {
        counts[p] = 0;
    });

    const appsForCurrentProgram = applications.value.filter(app => {
        return activeProgram.value ? String(app.program_id) === String(activeProgram.value.id) : true;
    });

    counts['All'] = appsForCurrentProgram.length;

    appsForCurrentProgram.forEach(app => {
        const appProvinceStr = (app.province || '').trim().toLowerCase();
        
        const matchedProvince = provinces.value.find(
            p => p.toLowerCase() === appProvinceStr && p !== 'All'
        );

        if (matchedProvince) {
            counts[matchedProvince]++;
        }
    });

    return counts;
});

</script>