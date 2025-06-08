<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white shadow rounded">
      <slot />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
