<template>
  <LoginLayout>
    <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">Email</label>
        <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 text-sm font-medium">Password</label>
        <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded" />
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Login
      </button>
      <p v-if="error" class="text-red-500 mt-2 text-sm">{{ error }}</p>
    </form>
  </LoginLayout>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import LoginLayout from '@/components/layouts/LoginLayout.vue'
import { useAuthStore } from '@/store/auth' 

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const login = async () => {
  error.value = ''
  try {
    const { data } = await axios.post('/api/login', {
      email: email.value,
      password: password.value
    })

    auth.setToken(data.token) 
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    const redirectTo = route.query.redirect || '/admin'
    router.push(redirectTo)

  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed.'
  }
}
</script>
