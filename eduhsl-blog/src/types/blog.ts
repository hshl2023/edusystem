export interface BlogPost {
  id: string
  title: string
  summary: string
  content: string
  publishDate: string
  author: string
  tags: string[]
  readTime: number
}

export interface BlogConfig {
  title: string
  description: string
  author: string
}