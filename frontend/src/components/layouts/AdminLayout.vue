<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md hidden md:flex flex-col">
      <div class="px-6 py-4 text-2xl font-bold border-b">v-dashboard</div>
      <nav class="flex-1 p-4 space-y-2 text-sm">
        <RouterLink to="/admin" class="flex items-center px-4 py-2 rounded hover:bg-gray-200"
          :class="{ 'bg-gray-200': $route.path === '/admin' }">
          <i class="mr-2">🏠</i> Dashboard
        </RouterLink>
        <RouterLink to="/admin/pages" class="flex items-center px-4 py-2 rounded hover:bg-gray-200"
          :class="{ 'bg-gray-200': $route.path.startsWith('/admin/pages') }">
          <i class="mr-2">📄</i> Pages
        </RouterLink>
      </nav>
    </aside>

    <!-- Main area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="flex items-center justify-between bg-white px-6 py-4 border-b shadow-sm">
        <h1 class="text-lg font-semibold">Mini Website Builder</h1>
        <div class="flex items-center space-x-4">
          <span class="text-sm">Hello, {{ user.name }}</span>
          <button @click="logout" class="text-sm text-blue-600 hover:underline">
            Logout
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto p-6 bg-gray-50">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth' 
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()
const user = auth.user || { name: 'Admin' }
const token = localStorage.getItem('token'); 

const logout = async () => {
  try {
    await axios.post('/api/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',

      }
    });

    auth.clearToken()
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']

    // Redirect to login page
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
</style>
