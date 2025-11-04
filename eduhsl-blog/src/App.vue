<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 eduhsl. Built with Vue 3 & TypeScript.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f9fa;
  color: #2c3e50;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
  width: 100%;
}

.footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-content p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem 15px;
  }
  
  .footer {
    padding: 1.5rem 0;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem 10px;
  }
  
  .footer {
    padding: 1rem 0;
  }
  
  .footer-content p {
    font-size: 0.8rem;
  }
}
</style>
