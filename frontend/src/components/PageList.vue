<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <router-link to="/admin/pages/create"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        + Add New Page
      </router-link>

      <input v-model="search" type="text" placeholder="Search by title or slug..."
        class="p-2 border border-gray-300 rounded w-64" />
    </div>

    <Vue3EasyDataTable :headers="headers" :items="filteredPages" :rows-per-page="5" :key-field="'id'">


      <!-- Actions Column with Edit and Delete Icons -->
      <template #item-action="{ id }">
        <div class="flex space-x-4">
          <!-- Edit Icon -->
          <router-link :to="`/admin/pages/${id}`" title="Edit" class="text-blue-600 hover:text-blue-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13.5v3.75a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75v-3.75m0 0L15 6l3 3-9 9H6v-3.75z" />
            </svg>
          </router-link>

          <!-- Delete Icon -->
          <button @click="confirmDelete(id)" title="Delete" class="text-red-600 hover:text-red-800 cursor-pointer"
            type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </template>
    </Vue3EasyDataTable>
  </div>
</template>
<script setup>
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { usePageStore } from '@/store/page'
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

const store = usePageStore()
const search = ref('')

// Fetch pages on component mount
onMounted(async () => {
  await store.fetchPages()
})

// Filter pages based on search input
const filteredPages = computed(() => {
  return store.pages
    .filter(
      p =>
        p.title.toLowerCase().includes(search.value.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.value.toLowerCase())
    )
    .map((p, i) => ({
      sn: i + 1,
      id: p.id,
      title: p.title,
      slug: p.slug,
      action: 'edit'
    }))
})

const headers = [
  { text: 'SN', value: 'sn' },
  { text: 'Title', value: 'title', sortable: true },
  { text: 'Slug', value: 'slug' },
  { text: 'Actions', value: 'action', sortable: false }
]

// Show confirmation dialog before deleting
async function confirmDelete(id) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  })

  if (result.isConfirmed) {
    deletePage(id)
  }
}

// Delete the page and show feedback
async function deletePage(id) {
  try {
    await store.deletePage(id)
    Swal.fire('Deleted!', 'Page has been deleted.', 'success')
  } catch (error) {
    console.error('Delete failed:', error)
    Swal.fire('Error!', 'Failed to delete page.', 'error')
  }
}
</script>
