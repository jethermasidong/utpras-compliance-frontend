<template>
  <div class="h-auto bg-white">
    <main class="max-w-4xl mx-auto mt-5 p-6 text-center">
      <h1 class="text-5xl font-extrabold text-gray-900 mb-6">
        Welcome to UTPRAS Program Compliance Portal
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        Streamline your tracking and manage your requirements with ease.
      </p>

      <div class="relative w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-5 mt-10">
        <div class="text-left mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Sign In</h2>
          <p class="text-md text-gray-500">Enter your credentials to access your dashboard.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 text-left">Email</label>
            <input v-model="email" type="email" class="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="you@example.com" required />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 text-left">Password</label>
            <input v-model="password" type="password" class="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="••••••••" required />
          </div>

          <button 
            type="submit"
            class="w-full bg-blue-600 text-white py-2 my-5 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '../api/userApi.js';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
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
      router.push('./provincial-dashboard') 
    }

    console.log("Login successful:", response);

  } catch (err) {
    alert("Login failed:" + err.message);
  }
};
</script>