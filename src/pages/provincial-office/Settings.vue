    <template>
    <div class="p-6 md:p-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <ProvincialSidebar class="hidden md:block w-64 shrink-0" /> 

        <main class="flex-1">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
            <p class="text-gray-500 text-sm">Manage your account security and preferences</p>
        </div>

        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
            <div class="p-6 border-b border-gray-50">
            <h2 class="text-sm font-bold text-black uppercase tracking-widest flex items-center gap-2">
                <ion-icon name="lock-closed-outline" class="text-lg"></ion-icon>
                Change Password
            </h2>
            </div>

            <form @submit.prevent="updateUserPassword" class="p-6 space-y-5">
            <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-2">Current Password</label>
                <div class="relative">
                <input 
                    :type="showCurrent ? 'text' : 'password'" 
                    v-model="form.currentPassword"
                    required
                    placeholder="Enter current password"
                    class="w-full bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 rounded-xl p-3 pr-10 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button type="button" @click="showCurrent = !showCurrent" class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    <ion-icon :name="showCurrent ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
                </button>
                </div>
            </div>

            <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-2">New Password</label>
                <div class="relative">
                <input 
                    :type="showNew ? 'text' : 'password'" 
                    v-model="form.newPassword"
                    required
                    minlength="8"
                    placeholder="Minimum 8 characters"
                    class="w-full bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 rounded-xl p-3 pr-10 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <button type="button" @click="showNew = !showNew" class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    <ion-icon :name="showNew ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
                </button>
                </div>
            </div>

            <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-2">Confirm New Password</label>
                <div class="relative">
                <input 
                    :type="showConfirm ? 'text' : 'password'" 
                    v-model="form.confirmPassword"
                    required
                    placeholder="Re-type new password"
                    :class="[
                    'w-full bg-gray-50 border text-sm font-semibold text-gray-800 rounded-xl p-3 pr-10 focus:bg-white focus:ring-2 outline-none transition-all',
                    passwordMismatch ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                    ]"
                />
                <button type="button" @click="showConfirm = !showConfirm" class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    <ion-icon :name="showConfirm ? 'eye-off-outline' : 'eye-outline'"></ion-icon>
                </button>
                </div>
                <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1 font-medium">New passwords do not match.</p>
            </div>

            <div class="pt-4 flex justify-end gap-3">
                <button 
                type="button" 
                @click="resetForm"
                class="px-5 py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                Cancel
                </button>
                <button 
                type="submit" 
                :disabled="isSubmitting || passwordMismatch || !form.newPassword"
                :class="[
                    'px-5 py-2.5 text-xs font-bold rounded-xl transition-colors',
                    (isSubmitting || passwordMismatch || !form.newPassword) 
                    ? 'bg-blue-300 text-white cursor-not-allowed' 
                    : 'bg-blue-900 text-white hover:bg-blue-800 shadow-md shadow-blue-200'
                ]"
                >
                {{ isSubmitting ? 'Updating...' : 'Update Password' }}
                </button>
            </div>
            </form>
        </section>
        </main>
    </div>
    </template>

    <script setup>
    import { ref, computed } from 'vue';
    import { useToast } from '../../../composables/useToast.js';
    import ProvincialSidebar from '../../components/ProvincialSidebar.vue';
    import { updatePassword } from '../../api/userApi.js';
    const { showToast } = useToast();

    const isSubmitting = ref(false);

    const showCurrent = ref(false);
    const showNew = ref(false);
    const showConfirm = ref(false);

    const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
    });

    const passwordMismatch = computed(() => {
    if (!form.value.confirmPassword) return false;
    return form.value.newPassword !== form.value.confirmPassword;
    });

    const resetForm = () => {
    form.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    showCurrent.value = false;
    showNew.value = false;
    showConfirm.value = false;
    };

    const updateUserPassword = async () => {
    if (passwordMismatch.value) {
        showToast('error', 'Error', 'New passwords do not match.');
        return;
    }

    isSubmitting.value = true;

    try {

        const data = {
            currentPassword: form.value.currentPassword,
            password: form.value.newPassword
        };
        
        await updatePassword(data);

        showToast('success', 'Success', 'Password updated successfully!');
        resetForm();
        
    } catch (error) {
        console.error(error);
        showToast('error', 'Update Failed', error.response?.data?.message || 'Could not update password. Please check your current password.');
    } finally {
        isSubmitting.value = false;
    }
    };
    </script>