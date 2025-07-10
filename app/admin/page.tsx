"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Tags, Users, TrendingUp } from "lucide-react"
import { adminPosts, adminTags, adminAuthors } from "@/lib/admin-data"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    tags: 0,
    authors: 0,
    featuredPosts: 0,
  })

  useEffect(() => {
    const posts = adminPosts.getAll()
    const tags = adminTags.getAll()
    const authors = adminAuthors.getAll()
    const featuredPosts = posts.filter((post) => post.featured).length

    setStats({
      posts: posts.length,
      tags: tags.length,
      authors: authors.length,
      featuredPosts,
    })
  }, [])

  const statCards = [
    {
      title: "Total Posts",
      value: stats.posts,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Tags",
      value: stats.tags,
      icon: Tags,
      color: "text-green-600",
    },
    {
      title: "Authors",
      value: stats.authors,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Featured Posts",
      value: stats.featuredPosts,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the blog administration panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <a
                href="/admin/posts/new"
                className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium">Create New Post</span>
              </a>
              <a
                href="/admin/tags"
                className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Tags className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium">Manage Tags</span>
              </a>
              <a
                href="/admin/authors"
                className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium">Manage Authors</span>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Storage</span>
                <span className="font-medium">Local Storage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
