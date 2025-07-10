import { mockPosts, mockTags, mockAuthors, type Post, type Tag, type Author } from "./mock-data"

// Admin data management with localStorage persistence
const STORAGE_KEYS = {
  POSTS: "admin_posts",
  TAGS: "admin_tags",
  AUTHORS: "admin_authors",
}

// Initialize data from localStorage or use defaults
function initializeData<T>(key: string, defaultData: T[]): T[] {
  if (typeof window === "undefined") return defaultData

  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultData
    }
  }

  // Save default data to localStorage
  localStorage.setItem(key, JSON.stringify(defaultData))
  return defaultData
}

// Get data with localStorage fallback
function getData<T>(key: string, defaultData: T[]): T[] {
  if (typeof window === "undefined") return defaultData

  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultData
    }
  }
  return defaultData
}

// Save data to localStorage
function saveData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

// Posts CRUD operations
export const adminPosts = {
  getAll: (): Post[] => getData(STORAGE_KEYS.POSTS, mockPosts),

  getById: (id: string): Post | null => {
    const posts = getData(STORAGE_KEYS.POSTS, mockPosts)
    return posts.find((post) => post.id === id) || null
  },

  getBySlug: (slug: string): Post | null => {
    const posts = getData(STORAGE_KEYS.POSTS, mockPosts)
    return posts.find((post) => post.slug === slug) || null
  },

  create: (post: Omit<Post, "id">): Post => {
    const posts = getData(STORAGE_KEYS.POSTS, mockPosts)
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
    }
    const updatedPosts = [newPost, ...posts]
    saveData(STORAGE_KEYS.POSTS, updatedPosts)
    return newPost
  },

  update: (id: string, updates: Partial<Post>): Post | null => {
    const posts = getData(STORAGE_KEYS.POSTS, mockPosts)
    const index = posts.findIndex((post) => post.id === id)

    if (index === -1) return null

    const updatedPost = { ...posts[index], ...updates }
    posts[index] = updatedPost
    saveData(STORAGE_KEYS.POSTS, posts)
    return updatedPost
  },

  delete: (id: string): boolean => {
    const posts = getData(STORAGE_KEYS.POSTS, mockPosts)
    const filteredPosts = posts.filter((post) => post.id !== id)

    if (filteredPosts.length === posts.length) return false

    saveData(STORAGE_KEYS.POSTS, filteredPosts)
    return true
  },
}

// Tags CRUD operations
export const adminTags = {
  getAll: (): Tag[] => getData(STORAGE_KEYS.TAGS, mockTags),

  getById: (id: string): Tag | null => {
    const tags = getData(STORAGE_KEYS.TAGS, mockTags)
    return tags.find((tag) => tag.id === id) || null
  },

  create: (tag: Omit<Tag, "id">): Tag => {
    const tags = getData(STORAGE_KEYS.TAGS, mockTags)
    const newTag: Tag = {
      ...tag,
      id: Date.now().toString(),
    }
    const updatedTags = [...tags, newTag]
    saveData(STORAGE_KEYS.TAGS, updatedTags)
    return newTag
  },

  update: (id: string, updates: Partial<Tag>): Tag | null => {
    const tags = getData(STORAGE_KEYS.TAGS, mockTags)
    const index = tags.findIndex((tag) => tag.id === id)

    if (index === -1) return null

    const updatedTag = { ...tags[index], ...updates }
    tags[index] = updatedTag
    saveData(STORAGE_KEYS.TAGS, tags)
    return updatedTag
  },

  delete: (id: string): boolean => {
    const tags = getData(STORAGE_KEYS.TAGS, mockTags)
    const filteredTags = tags.filter((tag) => tag.id !== id)

    if (filteredTags.length === tags.length) return false

    saveData(STORAGE_KEYS.TAGS, filteredTags)
    return true
  },
}

// Authors CRUD operations
export const adminAuthors = {
  getAll: (): Author[] => getData(STORAGE_KEYS.AUTHORS, mockAuthors),

  getById: (id: string): Author | null => {
    const authors = getData(STORAGE_KEYS.AUTHORS, mockAuthors)
    return authors.find((author) => author.id === id) || null
  },

  create: (author: Omit<Author, "id">): Author => {
    const authors = getData(STORAGE_KEYS.AUTHORS, mockAuthors)
    const newAuthor: Author = {
      ...author,
      id: Date.now().toString(),
    }
    const updatedAuthors = [...authors, newAuthor]
    saveData(STORAGE_KEYS.AUTHORS, updatedAuthors)
    return newAuthor
  },

  update: (id: string, updates: Partial<Author>): Author | null => {
    const authors = getData(STORAGE_KEYS.AUTHORS, mockAuthors)
    const index = authors.findIndex((author) => author.id === id)

    if (index === -1) return null

    const updatedAuthor = { ...authors[index], ...updates }
    authors[index] = updatedAuthor
    saveData(STORAGE_KEYS.AUTHORS, authors)
    return updatedAuthor
  },

  delete: (id: string): boolean => {
    const authors = getData(STORAGE_KEYS.AUTHORS, mockAuthors)
    const filteredAuthors = authors.filter((author) => author.id !== id)

    if (filteredAuthors.length === authors.length) return false

    saveData(STORAGE_KEYS.AUTHORS, filteredAuthors)
    return true
  },
}

// Initialize data on first load
export function initializeAdminData() {
  if (typeof window === "undefined") return

  initializeData(STORAGE_KEYS.POSTS, mockPosts)
  initializeData(STORAGE_KEYS.TAGS, mockTags)
  initializeData(STORAGE_KEYS.AUTHORS, mockAuthors)
}

// Export types
export type { Post, Tag, Author }
