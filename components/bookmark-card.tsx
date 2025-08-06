"use client"

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, ExternalLink, Globe } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Bookmark {
  id: string
  url: string
  title: string
  summary: string
  favicon?: string
  tags: string[]
  createdAt: Date
}

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(bookmark.id)
    } catch (error) {
      console.error('Error deleting bookmark:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {bookmark.favicon ? (
                <img
                  src={bookmark.favicon || "/placeholder.svg"}
                  alt=""
                  className="w-6 h-6 rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <Globe className={`w-6 h-6 text-muted-foreground ${bookmark.favicon ? 'hidden' : ''}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight truncate">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary truncate block mt-1 group-hover:underline"
              >
                {bookmark.url}
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0"
            >
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open link</span>
              </a>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete bookmark</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete bookmark</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this bookmark? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {bookmark.summary}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {bookmark.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(bookmark.createdAt)}
        </span>
      </CardFooter>
    </Card>
  )
}
