"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Save, ArrowLeft } from "lucide-react"
import { adminPosts, adminTags, adminAuthors, type Post, type Tag, type Author } from "@/lib/admin-data"
import Link from "next/link"

export default function NewPostPage() {
  const router = useRouter()
  const [authors, setAuthors] = useState<Author[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    html: "",
    feature_image: "",
    primary_author_id: "",
    primary_tag_id: "",
    featured: false,
  })

  useEffect(() => {
    setAuthors(adminAuthors.getAll())
    setTags(adminTags.getAll())
  }, [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prev) => {
      const exists = prev.find((t) => t.id === tag.id)
      if (exists) {
        return prev.filter((t) => t.id !== tag.id)
      } else {
        return [...prev, tag]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const primaryAuthor = authors.find((a) => a.id === formData.primary_author_id)
      const primaryTag = formData.primary_tag_id ? tags.find((t) => t.id === formData.primary_tag_id) : undefined

      if (!primaryAuthor) {
        alert("Please select an author")
        return
      }

      const newPost: Omit<Post, "id"> = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        html: formData.html,
        feature_image: formData.feature_image || null,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        primary_author: primaryAuthor,
        primary_tag: primaryTag,
        tags: selectedTags,
        featured: formData.featured,
      }

      adminPosts.create(newPost)
      router.push("/admin/posts")
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Error creating post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="text-gray-600 mt-2">Write and publish a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="post-url-slug"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the post"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="html">Content *</Label>
                  <Textarea
                    id="html"
                    value={formData.html}
                    onChange={(e) => setFormData((prev) => ({ ...prev, html: e.target.value }))}
                    placeholder="Write your post content in HTML or Markdown"
                    rows={15}
                    className="font-mono text-sm"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Select
                    value={formData.primary_author_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, primary_author_id: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="primary_tag">Primary Tag</Label>
                  <Select
                    value={formData.primary_tag_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, primary_tag_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="feature_image">Featured Image URL</Label>
                  <Input
                    id="feature_image"
                    value={formData.feature_image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, feature_image: e.target.value }))}
                    placeholder="/path/to/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))}
                  />
                  <Label htmlFor="featured">Featured Post</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={selectedTags.some((t) => t.id === tag.id)}
                        onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="text-sm">
                        {tag.name}
                      </Label>
                    </div>
                  ))}
                </div>

                {selectedTags.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium">Selected Tags:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                          {tag.name}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagToggle(tag)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
