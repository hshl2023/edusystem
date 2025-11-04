<template>
  <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

interface Props {
  content: string
}

const props = defineProps<Props>()

// Initialize markdown-it with syntax highlighting
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

const renderedContent = computed(() => {
  return md.render(props.content)
})
</script>

<style scoped>
.markdown-content {
  line-height: 1.8;
  color: #2c3e50;
}

/* Base typography */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.3;
  color: #2c3e50;
}

.markdown-content :deep(h1) {
  font-size: 2.25rem;
  margin-top: 0;
  border-bottom: 2px solid #e1e8ed;
  padding-bottom: 0.5rem;
}

.markdown-content :deep(h2) {
  font-size: 1.875rem;
  border-bottom: 1px solid #e1e8ed;
  padding-bottom: 0.25rem;
}

.markdown-content :deep(h3) {
  font-size: 1.5rem;
}

.markdown-content :deep(h4) {
  font-size: 1.25rem;
}

.markdown-content :deep(h5) {
  font-size: 1.125rem;
}

.markdown-content :deep(h6) {
  font-size: 1rem;
  color: #7f8c8d;
}

.markdown-content :deep(p) {
  margin-bottom: 1.25rem;
  font-size: 1rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 2rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(blockquote) {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  color: #34495e;
}

.markdown-content :deep(blockquote p) {
  margin-bottom: 0;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.875rem;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #e1e8ed;
}

.markdown-content :deep(th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.markdown-content :deep(tr:nth-child(even)) {
  background-color: #fafbfc;
}

.markdown-content :deep(a) {
  color: #3498db;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.markdown-content :deep(a:hover) {
  border-bottom-color: #3498db;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: #2c3e50;
}

.markdown-content :deep(em) {
  font-style: italic;
  color: #34495e;
}

.markdown-content :deep(code) {
  background-color: #f1f3f4;
  color: #d73a49;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875em;
}

.markdown-content :deep(pre) {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  overflow-x: auto;
  border: 1px solid #e1e8ed;
}

.markdown-content :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Syntax highlighting styles */
.markdown-content :deep(.hljs) {
  background-color: #f8f9fa !important;
  color: #2c3e50;
}

.markdown-content :deep(.hljs-comment),
.markdown-content :deep(.hljs-quote) {
  color: #6a737d;
  font-style: italic;
}

.markdown-content :deep(.hljs-keyword),
.markdown-content :deep(.hljs-selector-tag),
.markdown-content :deep(.hljs-subst) {
  color: #d73a49;
  font-weight: 600;
}

.markdown-content :deep(.hljs-number),
.markdown-content :deep(.hljs-literal),
.markdown-content :deep(.hljs-variable),
.markdown-content :deep(.hljs-template-variable),
.markdown-content :deep(.hljs-tag .hljs-attr) {
  color: #005cc5;
}

.markdown-content :deep(.hljs-string),
.markdown-content :deep(.hljs-doctag) {
  color: #032f62;
}

.markdown-content :deep(.hljs-title),
.markdown-content :deep(.hljs-section),
.markdown-content :deep(.hljs-selector-id) {
  color: #6f42c1;
  font-weight: 600;
}

.markdown-content :deep(.hljs-type),
.markdown-content :deep(.hljs-class .hljs-title) {
  color: #6f42c1;
}

.markdown-content :deep(.hljs-tag),
.markdown-content :deep(.hljs-name),
.markdown-content :deep(.hljs-attribute) {
  color: #22863a;
  font-weight: 400;
}

.markdown-content :deep(.hljs-regexp),
.markdown-content :deep(.hljs-link) {
  color: #e36209;
}

.markdown-content :deep(.hljs-symbol),
.markdown-content :deep(.hljs-bullet) {
  color: #005cc5;
}

.markdown-content :deep(.hljs-built_in),
.markdown-content :deep(.hljs-builtin-name) {
  color: #005cc5;
}

.markdown-content :deep(.hljs-meta) {
  color: #6f42c1;
}

.markdown-content :deep(.hljs-deletion) {
  background-color: #ffeef0;
}

.markdown-content :deep(.hljs-addition) {
  background-color: #f0fff4;
}

.markdown-content :deep(.hljs-emphasis) {
  font-style: italic;
}

.markdown-content :deep(.hljs-strong) {
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 768px) {
  .markdown-content :deep(h1) {
    font-size: 1.875rem;
  }
  
  .markdown-content :deep(h2) {
    font-size: 1.5rem;
  }
  
  .markdown-content :deep(h3) {
    font-size: 1.25rem;
  }
  
  .markdown-content :deep(pre) {
    padding: 0.75rem;
  }
  
  .markdown-content :deep(table) {
    font-size: 0.8rem;
  }
  
  .markdown-content :deep(th),
  .markdown-content :deep(td) {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .markdown-content :deep(h1) {
    font-size: 1.5rem;
  }
  
  .markdown-content :deep(h2) {
    font-size: 1.25rem;
  }
  
  .markdown-content :deep(h3) {
    font-size: 1.125rem;
  }
  
  .markdown-content :deep(pre) {
    padding: 0.5rem;
  }
  
  .markdown-content :deep(ul),
  .markdown-content :deep(ol) {
    padding-left: 1.5rem;
  }
}
</style>