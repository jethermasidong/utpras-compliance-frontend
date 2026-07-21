<template>
  <div class="min-h-auto bg-white flex flex-col lg:flex-row">
    <div class="hidden lg:flex lg:w-1/2 border-r border-gray-200 flex-col justify-center py-50">
      <div class="max-w-lg">
        <span class="inline-block text-xs font-semibold tracking-widest text-blue-600 uppercase mb-4">
          Compliance Portal
        </span>
        <h1 class="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          UTPRAS Program Compliance Portal
        </h1>
        <p class="text-lg text-gray-600 leading-relaxed">
          Streamline your tracking and manage your requirements with ease.
        </p>

        <div class="mt-12 space-y-4">
          <div class="flex items-start gap-3">
            <span class="mt-1 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
            <p class="text-sm text-gray-500">Track requirement status across programs in real time.</p>
          </div>
          <div class="flex items-start gap-3">
            <span class="mt-1 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
            <p class="text-sm text-gray-500">Role-based dashboards for regional and provincial teams.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-sm">
        <div class="lg:hidden text-center mb-8">
          <h1 class="text-2xl font-extrabold text-gray-900 mb-2">UTPRAS Portal</h1>
          <p class="text-sm text-gray-500">Program Compliance Portal</p>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Sign in</h2>
          <p class="text-sm text-gray-500 mt-1">Enter your credentials to access your dashboard.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                v-model="email"
                type="email"
                class="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-sm font-medium text-gray-700">Password</label>
            </div>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" />
              </svg>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabindex="-1"
              >
                <svg v-if="showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '../api/userApi.js';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const credentials = {
      email: email.value,
      password: password.value
    };

    const response = await loginUser(credentials);
    console.log("Full response from server:", response);

    const role = response.user.role;
    const token = response.token;

    localStorage.setItem("role", role);
    localStorage.setItem("token", token);

    if (role === "regional") {
      router.push('./regional-dashboard');
    } else {
      router.push('./provincial-dashboard');
    }

    console.log("Login successful:", response);

  } catch (err) {
    alert("Login failed:" + err.message);
  } finally {
    isLoading.value = false;
  }
};
</script>