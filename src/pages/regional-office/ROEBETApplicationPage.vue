  <template>
    <div class="p-6 md:p-10 max-w-450 mx-auto">
      <RegionalSidebar class="hidden md:block w-64 shrink-0" /> 
      <main class="flex-1 px-4">
      <div class="mb-6">
        <div class="flex flex-row justify-between">
          <h1 class="text-2xl font-bold text-gray-900 flex flex-row gap-3">Application - {{ profile.program_applied }}
            <div class="mt-1 h-9 rounded-lg px-2 py-1 border-2 hover:border-blue-300 hover:bg-blue-100 bg-white text-black border-gray-200 cursor-pointer">
              <ion-icon name="print-outline"></ion-icon>
            </div>
          </h1>
          <router-link to="/applications">
          <button class="font-bold h-9 flex flex-row text-xs items-center justify-center border-2 hover:border-blue-300 hover:bg-blue-100 bg-white text-black border-gray-200 px-3 py-1 rounded-xl cursor-pointer transition-colors ">
            <div class="mt-1">
            <ion-icon name="arrow-back-outline"></ion-icon>
            </div>Back
          </button>
          </router-link>
        </div>
        <p class="text-gray-500 text-sm">Check profile and requirements below</p>
      </div>

      <div class="flex flex-col gap-6">
        
        <section class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xs font-bold text-black uppercase tracking-widest">Institution Profile</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(label, key) in fieldLabels" :key="key" class="bg-gray-50 border border-gray-100 rounded-lg p-3">
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">{{ label }}</label>
              <div class="text-sm font-semibold text-gray-800 wrap-break-word">
                {{ profile[key] || 'N/A' }}
              </div>
            </div>
          </div>
        </section>

        <div class="p-6 border-b border-gray-100 rounded-2xl shadow-sm flex justify-between items-center">
            <h2 class="text-xs font-bold text-black uppercase tracking-widest">Required Documents</h2>
            <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
              {{ pendingCount }} Requirements
            </span>
          </div>

          

        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-400/50 text-[10px] uppercase text-black">
                  <th class="px-3 py-4">Requirement Title</th>
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

                <template v-for="(items, categoryName) in groupedRequirements" :key="categoryName">
          
                <tr class="bg-blue-50/60">
                  <td colspan="9" class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-blue-900">
                    {{ categoryName }} ({{ items.length }})
                  </td>
                </tr>

                <tr v-for="req in items" :key="req.requirement_id">
                  <td class="px-3 py-4 text-sm font-medium text-gray-700 flex flex-col">{{ req.title }}
                    <span class="text-[11px] font-light text-blue-600 rounded-full uppercase">
                      {{ req.description || '' }} 
                    </span>
                  </td>
                  <td class="px-3 py-4">
                    <div class="flex items-center gap-2 text-center">
                      <button 
                          :disabled="!req.file_url || req.file_url.trim() === ''"
                          @click="openPreview(req)"
                          :class="[
                              'font-bold text-xs border-2 px-3 py-1 rounded-xl transition-colors flex items-center justify-center',
                              (!req.file_url || req.file_url.trim() === '') 
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' 
                                  : 'bg-white text-black border-gray-200 hover:border-blue-300 hover:bg-blue-100 cursor-pointer'
                          ]"
                      >
                          <div class="mt-1">
                              <ion-icon name="eye-outline"></ion-icon> 
                          </div>
                      </button>
                  </div>
                  </td>
                  <td class="px-3 py-4 text-center"><span class="text-[10px] rounded-md uppercase px-2 py-1 bg-gray-50 text-black">{{ formatDate(req.uploaded_at)}}</span></td>
                  <td class="px-3 py-4 text-sm text-center">
                    <span :class="req.po_compliance === 'compliant' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-orange-50'"
                          class="text-[10px] font-bold px-2 py-1 rounded-xl uppercase">
                      {{ req.po_compliance || '...' }}
                    </span>
                  </td>
                  <td class="px-3 py-4 text-sm">
                      <select 
                      :disabled="!req.file_url || req.file_url.trim() === ''"
                      v-model="req.status" 
                      :class="[
                          'w-36 border rounded-xl text-center px-2 py-1 text-xs font-bold uppercase tracking-wide shadow-sm transition-all duration-200 outline-none',
                          (!req.file_url || req.file_url.trim() === '') 
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' 
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer'
                      ]"
                  >
                      <option disabled value="">Select status</option>
                      <option value="compliant" class="text-green-700 font-bold">Compliant</option>
                      <option value="non-compliant" class="text-red-600 font-bold">Non-Compliant</option>
                    </select>
                  </td>
                  <td class="px-3 py-4">
                      <textarea 
                        :disabled="!req.file_url || req.file_url.trim() === ''"
                        v-model="req.remarks" 
                        rows="2"
                        :class="[
                            'w-full border rounded-xl px-3 py-2 text-xs font-semibold outline-none transition-all resize-none',
                            (!req.file_url || req.file_url.trim() === '') 
                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60' 
                                : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100'
                        ]"
                    ></textarea>
                  </td>
                  <td class="px-3 py-4 text-center"><span class="text-[10px] px-2 py-1 rounded-xl uppercase bg-gray-50 text-black">{{ formatDate(req.reviewed_at) || '...'}}</span></td>
                  <td class="px-3 py-4 text-left whitespace-nowrap space-x-1">
                    <button 
                      :disabled="!req.file_url || req.file_url.trim() === ''"
                      @click="handleROCompliance(req)"
                      :class="[
                          'font-bold text-xs border-2 px-5 py-1 rounded-xl transition-colors',
                          (!req.file_url || req.file_url.trim() === '') 
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60' 
                              : 'bg-white text-black border-gray-200 hover:border-blue-300 hover:bg-blue-100 cursor-pointer'
                      ]"
                  >
                      Save
                  </button>
                  </td>
                </tr>
                </template>
                <tr v-if="documents.length === 0">
                  <td colspan="4" class="text-center py-8 text-gray-400 text-xs">No requirements found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10 p-4">
          <div v-if="application.length > 0">
            <div v-for="app in application" :key="app.application_id || app.id" class="flex flex-col md:flex-row items-center gap-3">
              <div class="flex items-center gap-2 w-full md:w-auto">
                <span class="text-center py-1 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase text-gray-800">RO Final Evaluation:</span>
              </div>
              <select 
                v-model="app.status" 
                class="w-48 border md:w-1/2 rounded-xl text-center px-3 py-2 text-xs font-bold uppercase tracking-wide bg-white text-gray-700 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
              >
                <option disabled value="">Select status</option>
                <option value="complete and successful" class="text-green-700 font-bold">Complete & Successful</option>
                <option value="complete with findings" class="text-green-400 font-bold">Complete with Findings</option>
                <option value="incomplete with findings" class="text-orange-600 font-bold">Incomplete with Findings</option>
                <option value="incomplete and unsuccessful" class="text-red-700 font-bold">Incomplete and Unsuccessful</option>
              </select>
              <div class="w-full md:w-1/4 text-center py-1 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold uppercase text-gray-800">
                {{ formatDate(app.date_issued || app.updated_at) }}
              </div>
              <button 
                @click="handleROFinalEvaluationSave(app)"
                class="font-bold text-xs border-2 bg-white text-black border-gray-200 px-5 py-2 rounded-xl transition-colors hover:border-blue-300 hover:bg-blue-100 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
          <div v-else class="text-center py-2 text-xs text-gray-400 uppercase tracking-wider">
            Loading evaluation details...
          </div>
        </section>
          
        </div>
      </main>
        <div v-if="previewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center mb-20 bg-black/50 backdrop-blur-sm p-4">
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">

            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wider">Preview: {{ activePreviewTitle }}</h3>
              <button @click="closePreview" class="text-gray-400 hover:text-gray-600 font-bold text-lg px-2">
                &times;
              </button>
            </div>
            <div class="p-6 flex-1 bg-gray-50 flex items-center justify-center overflow-auto min-h-100">
              
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
  import { viewApplicationByID, editROApplicationByProgID } from '../../api/applicationApi.js';
  import { viewDocuments, createDocument, editDocumentFileUpload, editDocumentPOCompliance } from '../../api/documentApi.js';
  import { createDocumentReview, updateDocumentReview } from '../../api/documentReviewApi.js';
  import { viewEBETProfileByApplicationID } from '../../api/ebetProfile.js';
  import { arrowBackOutline } from 'ionicons/icons';
  import RegionalSidebar from '../../components/RegionalSidebar.vue';
import { create } from 'axios';

  const route = useRoute();
  const { showToast } = useToast();

  const originalProfile = ref({});

  const fileInputs = ref({});

  const activeRequirementId = ref(null);

  const appId = route.query.applicationId;
  const progId = route.query.programId;

  const profile = ref({
    program_type: '', program_title: '', nominal_duration: '', enterprise_name: '', total_employees: '', 
    training_site: '', street_address: '', barangay: '', city: '', province: '', zipcode: '', website: '',
    telephone: '', mobile_no: ''
  });

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

  const documents = ref([]);
  const application = ref([]);

  const pendingCount = computed(() => documents.value.filter(r => !r.status || r.status === 'pending').length);

  const fetchApplication = async () => {
    try {
      const rawApps = await viewApplicationByID(appId);
      const appData = Array.isArray(rawApps) ? rawApps[0] : (rawApps.data || rawApps);

      if (appData) {
        application.value = [{
          ...appData,
          date_issued: appData.date_issued ? appData.date_issued.split('T')[0] : ''
        }];
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
      showToast('error', 'Error', 'Could not load current data.');
    }
  };

  onMounted(async () => {
    if (appId) {
      const data = await viewEBETProfileByApplicationID(appId);
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
    await fetchApplication(appId);
  });

  const hasChanged = computed(() => {
      return JSON.stringify(profile.value) !== JSON.stringify(originalProfile.value);
  });


  const handleROCompliance = async (req) => {
    showToast('info', 'Saving...', 'Saving RO Compliance Status');


    if (!req.document_id) {
      showToast('error', 'Error', 'No uploaded document found to review.');
      return;
    }
    const hasExistingEvaluation = req.review_id !== undefined && req.review_id !== null;
    
    try {

      const data = {
          status: req.status,
          remarks: req.remarks || ''
      };

      if (hasExistingEvaluation) {
        await updateDocumentReview(req.document_id, data);
      } else {
        await createDocumentReview(req.document_id, data);
      }
    

      showToast('success', 'Saved', 'Document review updated successfully.');

      if (progId) {
        documents.value = await viewDocuments(appId, progId);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast('error', 'Error', 'Could not save ro compliance status');
    }
  };

  const handleROFinalEvaluationSave = async (appObj) => {
    showToast('info', 'Saving...', 'Saving RO Compliance Final Evaluation.');

    if (!progId) {
      showToast('error', 'Error', 'Program ID not Found.');
      return;
    }

    try {
      const data = {
        status: appObj.status
      };
      
      await editROApplicationByProgID(progId, data);
      showToast('success', 'Saved', 'RO Final Evaluation updated successfully.');

      await fetchApplication(appId);
    } catch (error) {
      console.error("Failed to update final evaluation:", error);
      showToast('error', 'Error', 'Could not save RO final evaluation.');
    }
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

  const groupedRequirements = computed(() => {
    const categoryOrder = [
      'corporate and administrative documents',
      'curricular requirements',
      'program fees', 
      'additional requirements',
      'hidden requirements',
    ];

    const groups = documents.value.reduce((acc, req) => {
      const category = req.category ? req.category.toLowerCase() : 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(req);
      return acc;
    }, {});

    const sortedGroups = {};
    categoryOrder.forEach(cat => {
      if (groups[cat]) {
        sortedGroups[cat] = groups[cat];
      }
    });

    Object.keys(groups).forEach(cat => {
      if (!sortedGroups[cat]) {
        sortedGroups[cat] = groups[cat];
      }
    });

    return sortedGroups;
  });
  </script>