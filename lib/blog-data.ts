import { adminPosts, adminTags, adminAuthors, type Post, type Tag, type Author } from "./admin-data"

// Simulate async operations to match the original Ghost API interface
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getPosts(): Promise<Post[]> {
  await delay(100)
  return adminPosts.getAll().sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
}

export async function getPost(slug: string): Promise<Post | null> {
  await delay(50)
  return adminPosts.getBySlug(slug)
}

export async function getFeaturedPosts(): Promise<Post[]> {
  await delay(100)
  return adminPosts
    .getAll()
    .filter((post) => post.featured)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 3)
}

export async function getTags(): Promise<Tag[]> {
  await delay(50)
  return adminTags.getAll().sort((a, b) => a.name.localeCompare(b.name))
}

export async function getTag(slug: string): Promise<Tag | null> {
  await delay(50)
  const tags = adminTags.getAll()
  return tags.find((tag) => tag.slug === slug) || null
}

export async function getAuthors(): Promise<Author[]> {
  await delay(50)
  return adminAuthors.getAll()
}

export async function getAuthor(slug: string): Promise<Author | null> {
  await delay(50)
  const authors = adminAuthors.getAll()
  return authors.find((author) => author.slug === slug) || null
}

export async function searchPosts(query: string): Promise<Post[]> {
  await delay(200)
  const searchTerm = query.toLowerCase()
  const posts = adminPosts.getAll()

  return posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.html.toLowerCase().includes(searchTerm) ||
        post.tags?.some((tag) => tag.name.toLowerCase().includes(searchTerm)),
    )
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
}

// Export types for use in components
export type { Post, Tag, Author }
