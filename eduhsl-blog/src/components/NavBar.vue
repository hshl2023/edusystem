<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <h1>eduhsl</h1>
          <span class="brand-subtitle">AI Blog</span>
        </router-link>
      </div>
      
      <div class="nav-menu">
        <router-link to="/" class="nav-link" active-class="active">
          首页
        </router-link>
        <router-link to="/about" class="nav-link" active-class="active">
          关于我
        </router-link>
      </div>
      
      <div class="nav-toggle" @click="toggleMobileMenu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div class="mobile-menu" :class="{ 'is-open': isMobileMenuOpen }">
      <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
        首页
      </router-link>
      <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">
        关于我
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand .brand-link {
  display: flex;
  align-items: baseline;
  text-decoration: none;
  color: #2c3e50;
}

.nav-brand h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #3498db;
}

.brand-subtitle {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-left: 8px;
  font-weight: 400;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #3498db;
  background-color: #f8f9fa;
}

.nav-link.active {
  color: #3498db;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background-color: #3498db;
  border-radius: 2px;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background-color: #2c3e50;
  margin: 3px 0;
  transition: 0.3s;
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.mobile-menu.is-open {
  display: block;
}

.mobile-nav-link {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.mobile-nav-link:hover {
  color: #3498db;
  background-color: #f8f9fa;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .nav-toggle {
    display: flex;
  }
  
  .mobile-menu {
    display: none;
  }
  
  .mobile-menu.is-open {
    display: block;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 15px;
  }
  
  .nav-brand h1 {
    font-size: 1.5rem;
  }
  
  .brand-subtitle {
    font-size: 0.8rem;
  }
}
</style>