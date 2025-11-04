<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BlogPostCard from '@/components/BlogPostCard.vue'
import { blogPosts } from '@/data/blogPosts'

interface Props {
  tag: string
}

const props = defineProps<Props>()
const router = useRouter()

const decodedTag = decodeURIComponent(props.tag)

const filteredPosts = computed(() => {
  return blogPosts.filter(post => 
    post.tags.includes(decodedTag)
  ).sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )
})

const getRelatedTags = () => {
  const allTags = new Set<string>()
  filteredPosts.value.forEach(post => {
    post.tags.forEach(tag => {
      if (tag !== decodedTag) {
        allTags.add(tag)
      }
    })
  })
  return Array.from(allTags).slice(0, 8) // Show max 8 related tags
}

const navigateBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="tag-view">
    <!-- Back button -->
    <button @click="navigateBack" class="back-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      返回首页
    </button>

    <!-- Header section -->
    <header class="tag-header">
      <h1 class="tag-title">
        标签：<span class="tag-name">{{ decodedTag }}</span>
      </h1>
      <p class="tag-description">
        共找到 {{ filteredPosts.length }} 篇相关文章
      </p>
    </header>

    <!-- Posts section -->
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
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <h3>没有找到相关文章</h3>
        <p>该标签下暂时没有文章</p>
        <button @click="navigateBack" class="back-button">
          浏览其他文章
        </button>
      </div>
    </section>

    <!-- Related tags section -->
    <section v-if="filteredPosts.length > 0" class="related-tags-section">
      <h2 class="section-title">相关标签</h2>
      <div class="related-tags">
        <button
          v-for="relatedTag in getRelatedTags()"
          :key="relatedTag"
          @click="router.push(`/tag/${encodeURIComponent(relatedTag)}`)"
          class="related-tag-btn"
        >
          {{ relatedTag }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tag-view {
  max-width: 800px;
  margin: 0 auto;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  color: #2c3e50;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.back-button:hover {
  background-color: #e9ecef;
  transform: translateX(-4px);
}

.tag-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.tag-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tag-name {
  color: #ffd700;
  font-weight: 800;
}

.tag-description {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
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

.related-tags-section {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e1e8ed;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.related-tag-btn {
  padding: 0.5rem 1rem;
  background-color: #ecf0f1;
  border: 1px solid #e1e8ed;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-tag-btn:hover {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 768px) {
  .tag-header {
    padding: 1.5rem 1rem;
  }
  
  .tag-title {
    font-size: 1.75rem;
  }
  
  .tag-description {
    font-size: 1rem;
  }
  
  .related-tags-section {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .back-button {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }
  
  .tag-header {
    padding: 1rem 0.75rem;
  }
  
  .tag-title {
    font-size: 1.5rem;
  }
  
  .tag-description {
    font-size: 0.9rem;
  }
  
  .related-tags-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.125rem;
  }
  
  .related-tag-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>