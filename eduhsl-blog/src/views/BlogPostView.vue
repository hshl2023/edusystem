<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { blogPosts } from '@/data/blogPosts'

const route = useRoute()
const router = useRouter()

const postId = route.params.id as string

const post = computed(() => {
  return blogPosts.find(p => p.id === postId)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const navigateToTag = (tag: string) => {
  router.push(`/tag/${encodeURIComponent(tag)}`)
}

const navigateBack = () => {
  router.push('/')
}

// Redirect to home if post not found
if (!post.value) {
  router.push('/')
}
</script>

<template>
  <div v-if="post" class="blog-post-view">
    <!-- Back button -->
    <button @click="navigateBack" class="back-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      返回首页
    </button>

    <!-- Article header -->
    <header class="article-header">
      <h1 class="article-title">{{ post.title }}</h1>
      
      <div class="article-meta">
        <div class="meta-left">
          <span class="author">by {{ post.author }}</span>
          <span class="publish-date">{{ formatDate(post.publishDate) }}</span>
          <span class="read-time">{{ post.readTime }} 分钟阅读</span>
        </div>
      </div>

      <div class="article-tags">
        <span 
          v-for="tag in post.tags" 
          :key="tag" 
          class="tag"
          @click="navigateToTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </header>

    <!-- Article content -->
    <article class="article-content">
      <MarkdownRenderer :content="post.content" />
    </article>

    <!-- Article footer -->
    <footer class="article-footer">
      <div class="footer-content">
        <div class="navigation-buttons">
          <button @click="navigateBack" class="nav-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回文章列表
          </button>
        </div>
        
        <div class="article-stats">
          <span class="stat-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {{ post.readTime }} 分钟阅读
          </span>
          <span class="stat-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {{ post.tags.length }} 个标签
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.blog-post-view {
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

.article-header {
  padding: 3rem 3rem 2rem;
  border-bottom: 1px solid #e1e8ed;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.article-meta {
  margin-bottom: 1.5rem;
}

.meta-left {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.95rem;
  color: #7f8c8d;
}

.author {
  font-weight: 500;
  color: #34495e;
}

.publish-date {
  position: relative;
}

.publish-date::before {
  content: '•';
  position: absolute;
  left: -0.75rem;
  color: #bdc3c7;
}

.read-time {
  position: relative;
}

.read-time::before {
  content: '•';
  position: absolute;
  left: -0.75rem;
  color: #bdc3c7;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tag:hover {
  background-color: #3498db;
  color: #ffffff;
  transform: translateY(-2px);
}

.article-content {
  padding: 2rem 3rem;
}

.article-footer {
  background-color: #f8f9fa;
  padding: 2rem 3rem;
  border-top: 1px solid #e1e8ed;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.navigation-buttons {
  display: flex;
  gap: 1rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.article-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #7f8c8d;
  font-size: 0.875rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .blog-post-view {
    border-radius: 0;
    box-shadow: none;
  }
  
  .article-header {
    padding: 2rem 1.5rem 1.5rem;
  }
  
  .article-title {
    font-size: 2rem;
  }
  
  .meta-left {
    gap: 1rem;
    font-size: 0.875rem;
  }
  
  .publish-date::before,
  .read-time::before {
    left: -0.6rem;
  }
  
  .article-content {
    padding: 1.5rem;
  }
  
  .article-footer {
    padding: 1.5rem;
  }
  
  .footer-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .navigation-buttons {
    justify-content: center;
  }
  
  .article-stats {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .back-button {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }
  
  .article-header {
    padding: 1.5rem 1rem 1rem;
  }
  
  .article-title {
    font-size: 1.75rem;
  }
  
  .meta-left {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .publish-date::before,
  .read-time::before {
    display: none;
  }
  
  .article-tags {
    gap: 0.5rem;
  }
  
  .tag {
    font-size: 0.8rem;
    padding: 0.3rem 0.7rem;
  }
  
  .article-content {
    padding: 1rem;
  }
  
  .article-footer {
    padding: 1rem;
  }
  
  .nav-button {
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
  }
  
  .article-stats {
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }
}
</style>