<template>
  <article class="blog-post-card" @click="navigateToPost">
    <div class="post-header">
      <h2 class="post-title">{{ post.title }}</h2>
      <div class="post-meta">
        <span class="post-date">{{ formatDate(post.publishDate) }}</span>
        <span class="post-author">by {{ post.author }}</span>
        <span class="read-time">{{ post.readTime }} 分钟阅读</span>
      </div>
    </div>
    
    <div class="post-content">
      <p class="post-summary">{{ post.summary }}</p>
    </div>
    
    <div class="post-footer">
      <div class="post-tags">
        <span 
          v-for="tag in post.tags" 
          :key="tag" 
          class="tag"
          @click.stop="navigateToTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
      <div class="read-more">
        <span>阅读全文</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { BlogPost } from '@/types/blog'

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()
const router = useRouter()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const navigateToPost = () => {
  router.push(`/post/${props.post.id}`)
}

const navigateToTag = (tag: string) => {
  router.push(`/tag/${encodeURIComponent(tag)}`)
}
</script>

<style scoped>
.blog-post-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e1e8ed;
  margin-bottom: 1.5rem;
}

.blog-post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #3498db;
}

.post-header {
  margin-bottom: 1.5rem;
}

.post-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.blog-post-card:hover .post-title {
  color: #3498db;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: #7f8c8d;
}

.post-date {
  font-weight: 500;
}

.post-author {
  color: #95a5a6;
}

.read-time {
  color: #95a5a6;
}

.post-content {
  margin-bottom: 1.5rem;
}

.post-summary {
  font-size: 1rem;
  line-height: 1.6;
  color: #34495e;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tag:hover {
  background-color: #3498db;
  color: #ffffff;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3498db;
  font-weight: 500;
  font-size: 0.875rem;
  transition: gap 0.3s ease;
}

.blog-post-card:hover .read-more {
  gap: 0.75rem;
}

.read-more svg {
  transition: transform 0.3s ease;
}

.blog-post-card:hover .read-more svg {
  transform: translateX(2px);
}

/* Responsive design */
@media (max-width: 768px) {
  .blog-post-card {
    padding: 1.5rem;
  }
  
  .post-title {
    font-size: 1.25rem;
  }
  
  .post-meta {
    gap: 0.75rem;
  }
  
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .read-more {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .blog-post-card {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 1.1rem;
  }
  
  .post-meta {
    font-size: 0.8rem;
    gap: 0.5rem;
  }
  
  .post-summary {
    font-size: 0.9rem;
  }
  
  .tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
}
</style>