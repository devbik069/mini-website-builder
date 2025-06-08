<template>
  <div class="p-6 space-y-6">
    <div class="space-y-4">
      <!-- Page Title -->
      <div>
        <label for="page-title" class="block text-sm font-medium text-gray-700">Page Title</label>
        <input id="page-title" v-model="page.title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          :class="{ 'border-red-500': validationErrors.title }" placeholder="Enter page title" />
        <p v-if="validationErrors.title" class="text-red-600 text-sm mt-1">
          {{ validationErrors.title[0] }}
        </p>
      </div>

      <!-- Layout Selector -->
      <div>
        <label for="page-layout" class="block text-sm font-medium text-gray-700">Layout</label>
        <select id="page-layout" v-model="page.layout" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          :class="{ 'border-red-500': validationErrors.layout }">
          <option value="">-- Select Layout --</option>
          <option value="home">Home</option>
          <option value="contact">Contact</option>
          <option value="default">Default</option>
        </select>
        <p v-if="validationErrors.layout" class="text-red-600 text-sm mt-1">
          {{ validationErrors.layout[0] }}
        </p>
      </div>
    </div>


    <!-- Sections -->
    <div class="space-y-4">
      <draggable v-model="sections" item-key="id" handle=".drag-handle" animation="200" class="space-y-4"
        @end="onDragEnd">
        <template #item="{ element: section, index }">
          <div class="p-4 border rounded-lg shadow-sm bg-white flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <span class="cursor-move drag-handle text-gray-400 hover:text-gray-600" title="Drag to reorder">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
                </svg>
              </span>
              <button @click="removeSection(index)" class="text-red-600 hover:text-red-800 text-sm"
                title="Remove section">Remove</button>
            </div>

            <!-- Section Type -->
            <label class="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
            <select v-model="section.type" class="block w-full mb-3 rounded-md border-gray-300 shadow-sm bg-gray-100"
              :disabled="!!section.id">
              <option value="header">Header</option>
              <option value="text">Text</option>
              <option value="html">HTML</option>
              <option value="image">Image</option>
            </select>

            <!-- Section Content -->
            <div v-if="section.type === 'html'">
              <label class="block text-sm font-medium text-gray-700">Content (HTML)</label>
              <ckeditor :editor="editor" :config="editorConfig" v-model="section.content.text" class="mt-1" />
            </div>

            <div v-else-if="section.type === 'text'">
              <label class="block text-sm font-medium text-gray-700">Content (Plain Text)</label>
              <textarea v-model="section.content.text" rows="4"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="Enter text content"></textarea>
            </div>

            <div v-else-if="section.type === 'header'">
              <label class="block text-sm font-medium text-gray-700">Header Text</label>
              <input v-model="section.content.text" type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Enter header text" />
            </div>

            <div v-else-if="section.type === 'image'">
              <label class="block text-sm font-medium text-gray-700">Upload Image</label>
              <input type="file" accept="image/*" @change="handleImageUpload($event, section)"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              <div v-if="section.content.url" class="mt-2">
                <img :src="section.content.url" class="max-w-xs rounded shadow" />
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Add Section Button -->
    <div>
      <button @click="addSection" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Section
      </button>
    </div>

    <!-- Live Preview Toggle -->
    <div>
      <button @click="showPreview = !showPreview"
        class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded">
        {{ showPreview ? 'Hide Live Preview' : 'Show Live Preview' }}
      </button>
    </div>

    <!-- Live Preview -->
    <div v-if="showPreview" class="border p-4 rounded bg-gray-50 text-gray-800 max-h-96 overflow-auto">
      <h3 class="text-lg font-semibold mb-4">Live Preview ({{ page.layout || 'default' }} layout)</h3>
      <div v-html="layoutPreview()"></div>
    </div>

    <!-- Buttons -->
    <div class="flex space-x-4 mt-4">
      <button @click="$router.push('/admin/pages')"
        class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">
        Back to List
      </button>
      <button @click="savePage" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
        {{ isNew ? 'Save' : 'Update' }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import draggable from 'vuedraggable';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Custom Upload Adapter for CKEditor
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(file => {
      const formData = new FormData();
      formData.append('upload', file);

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',

        },
      };

      return axios.post('/api/uploads', formData, config)
        .then(response => ({ default: response.data.url }))
        .catch(error => {
          console.error('Upload failed:', error);
          return Promise.reject(error);
        });
    });
  }


  abort() { }
}

// Plugin to inject our custom upload adapter into CKEditor
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

export default {
  components: {
    ckeditor: CKEditor.component,
    draggable,
  },
  data() {
    return {
      page: { id: null, title: '', layout: '' },
      sections: [],
      isNew: false,
      validationErrors: {},
      editor: ClassicEditor,
      editorConfig: {
        extraPlugins: [MyCustomUploadAdapterPlugin],
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'link', '|',
          'bulletedList', 'numberedList', 'blockQuote', '|',
          'alignment',
          'undo', 'redo', '|',
          'imageUpload'
        ],
        image: {
          toolbar: [
            'imageTextAlternative',
            '|',
            'imageStyle:alignLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignRight',
          ],
          styles: ['alignLeft', 'alignCenter', 'alignRight'],
        },
      },
      showPreview: false,
    };
  },
  computed: {

    // Renders combined content for live preview
    combinedContent() {
      return this.sections.map(section => {
        switch (section.type) {
          case 'header':
            return `<h2 class="text-2xl font-bold my-4">${section.content.text}</h2>`;
          case 'text':
            return `<div class="prose">${section.content.text}</div>`;
          case 'html':
            return `<div>${section.content.text}</div>`;
          case 'image':
            return `<div class="my-4"><img src="${section.content.url}" class="max-w-full mx-auto"/></div>`;
          default:
            return '';
        }
      }).join('<hr class="my-4 border-gray-300"/>');
    },
  },
  methods: {

    // Generates HTML preview based on selected layout
    layoutPreview() {
      const titleHtml = `<h2 class="text-2xl font-bold mb-4">${this.page.title}</h2>`;

      if (this.page.layout === 'home') {
        return `<div class="bg-blue-100 p-4 rounded">
      ${titleHtml}
          ${this.combinedContent}
        </div>`;
      } else if (this.page.layout === 'contact') {
        return `<div class="bg-green-100 p-4 rounded">
      ${titleHtml}
          ${this.combinedContent}
          <div class="mt-4 text-sm text-gray-600">Contact form will appear here...</div>
        </div>`;
      } else {

        return `${titleHtml}${this.combinedContent}`;
      }
    },

    // Initializes the form with page data or empty form
    async initialize() {
      const pageId = this.$route.params.pageId;
      const token = localStorage.getItem('token'); // or from Vuex, Pinia, etc.

      if (pageId) {
        try {
          const { data } = await axios.get(`/api/pages/${pageId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',

            },
          });

          this.page = {
            id: data.id,
            title: data.title,
            layout: data.layout || '',
          };

          this.sections = (data.sections || []).map(section => ({
            ...section,
            content: typeof section.content === 'string'
              ? JSON.parse(section.content)
              : section.content || { text: '' },
          }));

          this.isNew = false;
        } catch (error) {
          console.error('Error loading page:', error);
        }
      } else {
        this.page = { id: null, title: '', layout: '' };
        this.sections = [];
        this.isNew = true;
      }

      this.showPreview = false;
    },


    addSection() {
      this.sections.push({
        type: 'text',
        content: { text: '' },
      });
    },

    // Removes a section by index
    removeSection(index) {
      this.sections.splice(index, 1);
    },

    // Uploads an image file and updates section content
    async handleImageUpload(event, section) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('upload', file);

      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',

          },
        };
        const response = await axios.post('/api/uploads', formData, config);

        section.content.url = response.data.url;
        toast.success("Image uploaded successfully!");

        event.target.value = null;

      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload image.");
      }
    },

    // Save or update the page (function cut off in your original message)
    async savePage() {
      this.saving = true;
      this.validationErrors = {};
      try {
        const payload = {
          title: this.page.title,
          layout: this.page.layout,
          sections: this.sections,
        };

        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, Accept: 'application/json',
          },

        };

        let response;
        if (this.isNew) {
          response = await axios.post('/api/pages', payload, config);
          toast.success("Page added successfully!");
          setTimeout(() => {
            this.$router.push('/admin/pages');
          }, 1500);
        } else {
          response = await axios.put(`/api/pages/${this.page.id}`, payload, config);
          toast.success("Page updated successfully!");
        }

        if (response?.data) {
          this.page = response.data;
          this.sections = response.data.sections || [];
        }
      } catch (error) {
        console.error('Error saving page:', error);
        if (error.response?.status === 422) {
          this.validationErrors = error.response.data.errors;
        } else {
          toast.error("Failed to save page.");
        }
      } finally {
        this.saving = false;
      }
    },

    // Handles the logic to update the section order when a drag-and-drop action is completed
    async onDragEnd() {
      const orderedSectionIds = this.sections
        .map((section, index) => section.id ? { id: section.id, position: index + 1 } : null)
        .filter(Boolean);

      if (!orderedSectionIds.length) return;

      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', },
        };

        await axios.put(`/api/pages/${this.page.id}/reorder-sections`, {
          ordered_sections: orderedSectionIds,
        }, config);

        toast.success("Section order saved!");
      } catch (error) {
        console.error("Failed to update section order:", error.response?.data || error.message);
        toast.error("Failed to save section order.");
      }
    },

  },
  created() {
    this.initialize();
  },
  watch: {
    '$route.params.pageId'() {
      this.initialize();
    },
  },
};
</script>

<style>
.image-style-align-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.image-style-align-left {
  float: left;
  margin-right: 1rem;
}

.image-style-align-right {
  float: right;
  margin-left: 1rem;
}

.drag-handle {
  cursor: move;
}
</style>
