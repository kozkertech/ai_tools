"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, User, Save } from "lucide-react"
import { adminAuthors, type Author } from "@/lib/admin-data"

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    profile_image: "",
    bio: "",
  })

  useEffect(() => {
    loadAuthors()
  }, [])

  const loadAuthors = () => {
    setAuthors(adminAuthors.getAll())
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const openCreateDialog = () => {
    setEditingAuthor(null)
    setFormData({ name: "", slug: "", profile_image: "", bio: "" })
    setIsDialogOpen(true)
  }

  const openEditDialog = (author: Author) => {
    setEditingAuthor(author)
    setFormData({
      name: author.name,
      slug: author.slug,
      profile_image: author.profile_image || "",
      bio: author.bio || "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingAuthor) {
      // Update existing author
      adminAuthors.update(editingAuthor.id, {
        name: formData.name,
        slug: formData.slug,
        profile_image: formData.profile_image,
        bio: formData.bio,
      })
    } else {
      // Create new author
      adminAuthors.create({
        name: formData.name,
        slug: formData.slug,
        profile_image: formData.profile_image,
        bio: formData.bio,
      })
    }

    loadAuthors()
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this author?")) {
      adminAuthors.delete(id)
      loadAuthors()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Authors</h1>
          <p className="text-gray-600 mt-2">Manage blog authors and contributors</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          New Author
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <Card key={author.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={author.profile_image || "/placeholder.svg"} alt={author.name} />
                    <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{author.name}</h3>
                    <p className="text-sm text-gray-500">@{author.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(author)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(author.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {author.bio && (
                <div className="mt-3">
                  <p className="text-sm text-gray-700 line-clamp-3">{author.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {authors.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No authors yet</h3>
                <p className="text-gray-600 mb-4">Add your first author to start publishing content</p>
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Author
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAuthor ? "Edit Author" : "Create New Author"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Author name"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="author-slug"
                required
              />
            </div>

            <div>
              <Label htmlFor="profile_image">Profile Image URL</Label>
              <Input
                id="profile_image"
                value={formData.profile_image}
                onChange={(e) => setFormData((prev) => ({ ...prev, profile_image: e.target.value }))}
                placeholder="/path/to/profile.jpg"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Author biography"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingAuthor ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
