import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, User } from "lucide-react"

interface GuideLayoutProps {
  title: string
  description?: string
  difficulty?: "Beginner" | "Intermediate" | "Advanced"
  tags?: string[]
  author?: string
  publishDate?: string
  readingTime?: string
  children: ReactNode
}

export function GuideLayout({
  title,
  description,
  difficulty,
  tags = [],
  author,
  publishDate,
  readingTime,
  children,
}: GuideLayoutProps) {
  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800 hover:bg-green-200",
    Intermediate: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Advanced: "bg-red-100 text-red-800 hover:bg-red-200",
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>

        {description && <p className="text-xl text-muted-foreground mb-6">{description}</p>}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {difficulty && <Badge className={difficultyColors[difficulty]}>{difficulty}</Badge>}

          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Author and date info */}
        {(author || publishDate || readingTime) && (
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
                <span>{publishDate}</span>
              </div>
            )}

            {readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-8">
          <div className="prose prose-gray max-w-none dark:prose-invert">{children}</div>
        </CardContent>
      </Card>
    </div>
  )
}
