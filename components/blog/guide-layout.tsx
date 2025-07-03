"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, User, Tag } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface GuideLayoutProps {
  title: string
  description: string
  author: string
  publishDate: string
  readingTime: number
  tags: Array<{ id: string; name: string; slug: string }>
  difficulty?: "Beginner" | "Intermediate" | "Advanced"
  children: React.ReactNode
}

export function GuideLayout({
  title,
  description,
  author,
  publishDate,
  readingTime,
  tags,
  difficulty = "Beginner",
  children,
}: GuideLayoutProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Guide Header */}
      <Card className="mb-8">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              GUIDE
            </Badge>
            <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h1>

          {description && <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
            )}

            {publishDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(publishDate)}</span>
              </div>
            )}

            {readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Guide Content */}
      <Card>
        <CardContent className="prose prose-gray dark:prose-invert max-w-none p-8">{children}</CardContent>
      </Card>
    </div>
  )
}

export default GuideLayout
