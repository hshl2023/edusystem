<script setup lang="ts">
import { ref, computed } from 'vue'
import BlogPostCard from '@/components/BlogPostCard.vue'
import { blogPosts } from '@/data/blogPosts'

const searchQuery = ref('')
const selectedTag = ref('')

const allTags = computed(() => {
  const tags = new Set<string>()
  blogPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
})

const filteredPosts = computed(() => {
  let filtered = blogPosts

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    )
  }

  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter(post => 
      post.tags.includes(selectedTag.value)
    )
  }

  return filtered.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )
})

const selectTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedTag.value = ''
}
</script>

<template>
  <div class="home-view">
    <!-- Header section -->
    <header class="home-header">
      <h1 class="page-title">eduhsl 的 AI 博客</h1>
      <p class="page-subtitle">
        探索人工智能技术发展趋势，分享大模型应用实践，记录软件开发变革历程
      </p>
    </header>

    <!-- Search and filter section -->
    <section class="search-section">
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章标题、摘要或内容..."
            class="search-input"
          />
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        
        <button 
          v-if="searchQuery || selectedTag"
          @click="clearFilters"
          class="clear-filters-btn"
        >
          清除筛选
        </button>
      </div>

      <!-- Tags filter -->
      <div class="tags-filter">
        <h3 class="filter-title">标签筛选</h3>
        <div class="tags-list">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="selectTag(tag)"
            :class="['tag-btn', { active: selectedTag === tag }]"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <!-- Blog posts list -->
    <section class="posts-section">
      <div v-if="filteredPosts.length > 0" class="posts-container">
        <BlogPostCard 
          v-for="post in filteredPosts" 
          :key="post.id" 
          :post="post"
        />
      </div>
      
      <div v-else class="no-results">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <path d="m8 11h6"/>
        </svg>
        <h3>没有找到相关文章</h3>
        <p>尝试调整搜索关键词或选择其他标签</p>
        <button @click="clearFilters" class="clear-filters-btn">
          查看所有文章
        </button>
      </div>
    </section>

    <!-- Statistics section -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-number">{{ blogPosts.length }}</span>
          <span class="stat-label">篇文章</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ allTags.length }}</span>
          <span class="stat-label">个标签</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">
            {{ Math.round(blogPosts.reduce((sum, post) => sum + post.readTime, 0) / blogPosts.length) }}
          </span>
          <span class="stat-label">分钟平均阅读</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 100%;
}

.home-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  margin-left: -20px;
  margin-right: -20px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.search-section {
  margin-bottom: 2rem;
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
  position: relative;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #ffffff;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.clear-filters-btn {
  padding: 0.75rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.clear-filters-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.tags-filter {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e1e8ed;
}

.filter-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-btn {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-btn:hover {
  background-color: #ecf0f1;
  border-color: #bdc3c7;
}

.tag-btn.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

.posts-section {
  margin-bottom: 3rem;
}

.posts-container {
  display: grid;
  gap: 0;
}

.no-results {
  text-align: center;
  padding: 3rem 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e1e8ed;
}

.no-results svg {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.no-results h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.stats-section {
  margin-top: 3rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e1e8ed;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #7f8c8d;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .home-header {
    margin-left: -15px;
    margin-right: -15px;
    padding: 1.5rem 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .clear-filters-btn {
    width: 100%;
    text-align: center;
  }
  
  .tags-filter {
    padding: 1rem;
  }
  
  .stats-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .home-header {
    margin-left: -10px;
    margin-right: -10px;
    padding: 1rem 0.75rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
  
  .tags-filter {
    padding: 0.75rem;
  }
  
  .filter-title {
    font-size: 1rem;
  }
  
  .tag-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
}
</style>
