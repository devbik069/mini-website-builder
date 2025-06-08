import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth' 

// Define a store to manage pages
export const usePageStore = defineStore('page', () => {
  const pages = ref([])
  const loading = ref(false)

  const auth = useAuthStore() 

  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
    }
  })

  // Fetch all pages from the API
  const fetchPages = async () => {
    loading.value = true
    try {
      const response = await axios.get('/api/pages', authHeader())
      pages.value = response.data
    } catch (err) {
      console.error('Error fetching pages:', err)
    } finally {
      loading.value = false
    }
  }

  // Delete a page by ID
  const deletePage = async (id) => {
    try {
      await axios.delete(`/api/pages/${id}`, authHeader())
      pages.value = pages.value.filter(p => p.id !== id)
    } catch (err) {
      console.error('Error deleting page:', err)
      throw err
    }
  }

  return {
    pages,
    loading,
    fetchPages,
    deletePage,
  }
})
