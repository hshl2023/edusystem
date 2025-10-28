<template>
  <div id="app">
    <LoadingSpinner v-if="loadingStore.isLoading" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const loadingStore = useLoadingStore()

onMounted(() => {
  authStore.initializeFromStorage()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: #f5f7fa;
  color: #333;
}

#app {
  min-height: 100vh;
}
</style>
