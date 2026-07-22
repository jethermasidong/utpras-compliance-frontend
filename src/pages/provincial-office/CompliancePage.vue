<template>
  <div class="p-6 md:p-10 max-w-450 mx-auto">
    <ProvincialSidebar class="hidden md:block w-64 shrink-0" /> 
    <main class="flex-1 px-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Application - {{ profile.program_applied }}</h1>
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
                <th class="px-3 py-4">Requirement Title</th>
                <th class="px-3 py-4">Description</th>
                <th class="px-3 py-4">Documents</th>
                <th class="px-3 py-4">Date Uploaded</th>
                <th class="px-3 py-4">PO Compliance</th>
                <th class="px-3 py-4">RO Compliance</th>
                <th class="px-3 py-4">Remarks</th>
                <th class="px-3 py-4">Date Reviewed</th>
                <th class="px-3 py-4">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="req in documents" :key="req.requirement_id">
                <td class="px-3 py-4 text-sm font-medium text-gray-700">{{ req.title }}</td>
                <td class="px-3 py-4 text-xs font-medium text-gray-700">{{ req.description }}</td>
                <td class="px-3 py-4">
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.png,.docx"
                    :ref="el => fileInputs[req.requirement_id] = el" 
                    @change="(e) => handleFileSelected(e, req.requirement_id)" 
                    class="hidden" 
                  />
                  <div class="flex items-center gap-2">
                    <button 
                      v-if="req.file_url && req.file_url.trim() !== ''"
                      @click="openPreview(req)"
                      class="text-green-700 font-bold text-xs bg-green-50 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      View
                    </button>

                    <button 
                      @click="triggerFileInput(req.requirement_id)"
                      class="text-blue-900 font-bold text-xs bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {{ req.file_url ? 'Change' : 'Upload' }}
                    </button>
                  </div>
                </td>
                <td class="px-3 py-4 text-center"><span class="text-[12px] rounded-md uppercase px-2 py-1 bg-gray-50 text-black">{{ formatDate(req.uploaded_at)}}</span></td>
                <td class="px-3 py-4 text-sm">
                    <select 
                        placeholder="Upload Document First"
                        v-if="req.file_url && req.file_url.trim() !== ''"
                        v-model="req.po_compliance" 
                        class="w-25 bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:bg-white outline-none focus:ring-1 focus:ring-blue-500 uppercase font-bold text-gray-700"
                    >
                        <option disabled value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="active">Yes</option>
                        <option value="approved">No</option>
                    </select>
                    <span v-else class="text-[10px] flex text-center font-bold px-2 py-1 rounded-md uppercase text-black bg-gray-50">
                        Upload document first
                    </span>
                </td>
                <td class="px-3 py-4">
                  <span :class="req.status === 'compliant' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'"
                        class="text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    {{ req.status || 'pending' }}
                  </span>
                </td>
                <td class="px-3 py-4"><span class="text-[12px] px-2 py-1 rounded-md uppercase bg-gray-50 text-black">{{ req.remarks || '...' }}</span></td>
                <td class="px-3 py-4"><span class="text-[12px] px-2 py-1 rounded-md uppercase bg-gray-50 text-black">{{ req.reviewed_at || '...'}}</span></td>
                <td class="px-3 py-4 text-center whitespace-nowrap space-x-1">
                  <button 
                    v-if="req.file_url && req.file_url.trim() !== ''"
                    @click="handlePOComplianceUpdate(req)"
                    class="bg-blue-50 text-blue-800 font-bold text-xs px-5 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Save Compliance
                  </button>
                  <span v-else class="text-[10px] font-bold px-2 py-1 rounded-md uppercase text-black bg-gray-50">
                    Upload document first
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      </div>
    </main>
      <div v-if="previewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">

          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wider">Preview: {{ activePreviewTitle }}</h3>
            <button @click="closePreview" class="text-gray-400 hover:text-gray-600 font-bold text-lg px-2">
              &times;
            </button>
          </div>
          <div class="p-6 flex-1 bg-gray-50 flex items-center justify-center overflow-auto min-h-[400px]">
            
            <img 
              v-if="activePreviewUrl.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)" 
              :src="activePreviewUrl" 
              class="max-h-[70vh] object-contain rounded-lg shadow-sm" 
              alt="Document Preview"
            />

            <iframe 
              v-else-if="activePreviewUrl.match(/\.pdf(\?.*)?$/i)" 
              :src="activePreviewUrl" 
              class="w-full h-[70vh] rounded-lg border border-gray-200 bg-white"
            ></iframe>

            <div v-else class="text-center py-12">
              <p class="text-sm text-gray-600 mb-4">Direct preview is not available for this file format (e.g., DOCX).</p>
              <a 
                :href="activePreviewUrl" 
                target="_blank" 
                class="bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Download File to View
              </a>
            </div>

          </div>

          <div class="px-6 py-3 border-t border-gray-100 flex justify-end gap-2 bg-white">
            <a 
              :href="activePreviewUrl" 
              target="_blank"
              class="bg-gray-100 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Open in New Tab
            </a>
            <button 
              @click="closePreview"
              class="bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from '../../../composables/useToast.js';
import { viewApplicationsByUser } from '../../api/applicationApi.js';
import { viewDocuments, createDocument, editDocumentFileUpload, editDocumentPOCompliance } from '../../api/documentApi.js';
import ProvincialSidebar from '../../components/ProvincialSidebar.vue';
import { editIBTProfile, viewIBTProfileByApplicationID } from '../../api/ibtProfileApi.js';

const route = useRoute();
const { showToast } = useToast();
const originalProfile = ref({});
const fileInputs = ref({});

const activeRequirementId = ref(null);

const triggerFileInput = (requirementId) => {
  activeRequirementId.value = requirementId;
  if (fileInputs.value[requirementId]) {
    fileInputs.value[requirementId].click();
  }
};


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

const handleFileSelected = async (event, requirementId) => {
  const file = event.target.files[0];
  if (!file) return;

  activeRequirementId.value = requirementId;
  const currentReq = documents.value.find(r => r.requirement_id === requirementId);
  const hasExistingFile = currentReq && currentReq.file_url && currentReq.file_url.trim() !== '';

  const data = new FormData();
  data.append('file', file);
  data.append('version', hasExistingFile ? (Number(currentReq.version || 1) + 1) : 1);
  data.append('po_compliance', 'pending');

  try {
    showToast('info', 'Uploading....', 'Uploading document to cloud storage...');

    if (hasExistingFile) {
      await editDocumentFileUpload(appId, requirementId, data);
    } else {
      await createDocument(appId, requirementId, data);
    }
    showToast('success', 'Uploaded', 'Document uploaded successfully!');

    documents.value = await viewDocuments(appId, progId);
  } catch (error) {
    console.error("Uploaded failed:", error);
    showToast('error', 'Error Uploading', 'Failed to upload document.');
  } finally {
    activeRequirementId.value = null;
    event.target.value = '';
  }
};

const handlePOComplianceUpdate = async (req) => {
  try {
    const data = {
      po_compliance: req.po_compliance,
    };

    await editDocumentPOCompliance(appId, req.requirement_id, data);
    showToast('success', 'Saved', 'PO Compliance Saved');
    documents.value = await viewDocuments(appId, progId);
  } catch (error) {
    showToast('error', 'Error', 'Could not save current data.');
  }
}


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

const previewModalOpen = ref(false);
const activePreviewUrl = ref('');
const activePreviewTitle = ref('');

const openPreview = (req) => {
  if (!req.file_url) return;
  activePreviewUrl.value = getFileUrl(req.file_url);
  activePreviewTitle.value = req.title;
  previewModalOpen.value = true;
};

const closePreview = () => {
  previewModalOpen.value = false;
  activePreviewUrl.value = '';
  activePreviewTitle.value = '';
};

</script>