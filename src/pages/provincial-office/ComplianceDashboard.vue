<template>
  <div class="p-6 md:p-10 max-w-7xl mx-auto">
    <ProvincialSidebar class="hidden md:block" /> 
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
      <p class="text-gray-500">Select a program to view pending applications</p>
    </div>


    <div class="flex gap-4 mb-8 overflow-x-auto pb-2">
      <button 
        v-for="program in programs" :key="program.id"
        @click="selectProgram(program)"
        :class="[
          'px-6 py-3 font-bold rounded-xl transition-all duration-200 border-2',
          activeProgram?.id === program.id 
            ? 'bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-200' 
            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
        ]"
      >
        {{ program.program_name }}
      </button>
    </div>


    <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-50 flex justify-between items-center">
        <h2 class="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {{ activeProgram ? activeProgram.program_name : 'Select a program' }} Applications
        </h2>
        <span class="text-[10px] font-bold text-gray-400 uppercase">
          {{ filteredApplications.length }} Records Found
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 text-[10px] uppercase text-gray-400">
              <th class="px-6 py-4">Applicant Name</th>
              <th class="px-6 py-4">Program Applied</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Date Created</th>
              <th class="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="app in filteredApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-sm">{{ app.applicant_name }}</td>
              <td class="px-6 py-4 text-sm">{{ app.program_applied }}</td>
              <td class="px-6 py-4">
                <span class="text-[10px] font-bold px-2 py-1 rounded-md uppercase bg-blue-50 text-blue-700">
                  {{ app.status || 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ app.created_at }}</td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="goToCompliance(app.id)"
                  class="text-blue-900 font-bold text-xs bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  View Application
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
import { viewPrograms } from '../../api/programApi.js';
import { viewApplicationsByUser } from '../../api/applicationApi.js';
import { viewIBTProfileByApplicationID } from '../../api/ibtProfileApi.js';
import ProvincialSidebar from '../../components/ProvincialSidebar.vue';

const router = useRouter();
const programs = ref([]);
const applications = ref([]);
const activeProgram = ref(null);

onMounted(async () => {
  programs.value = await viewPrograms();
  applications.value = await viewApplicationsByUser();
  if (programs.value.length > 0) activeProgram.value = programs.value[0];
});



const selectProgram = (program) => {
  activeProgram.value = program;
};

const filteredApplications = computed(() => {
  if (!activeProgram.value) return [];
  return applications.value.filter(app => app.program_id === activeProgram.value.id);
});

const goToCompliance = (id) => {
  router.push({ path: '/compliance-page', query: { applicationId: id } });
};
</script>