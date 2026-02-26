"use client"

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, ExternalLink, Globe, Calendar } from 'lucide-react'
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
    <Card className="group relative overflow-hidden rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      {/* subtle hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          
          {/* LEFT */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            
            {/* favicon */}
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
              {bookmark.favicon ? (
                <img
                  src={bookmark.favicon}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <Globe className={`w-4 h-4 text-muted-foreground ${bookmark.favicon ? 'hidden' : ''}`} />
            </div>

            {/* title + link */}
            <div className="min-w-0">
              <h3 className="font-semibold text-sm leading-snug truncate">
                {bookmark.title}
              </h3>

              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition block truncate mt-1"
              >
                {bookmark.url}
              </a>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 hover:bg-primary/10"
            >
              <a href={bookmark.url} target="_blank">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete bookmark</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your bookmark.
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

      {/* SUMMARY */}
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {bookmark.summary}
        </p>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex items-center justify-between gap-2 border-t pt-4">
        
        {/* TAGS */}
        <div className="flex flex-wrap gap-1">
          {bookmark.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-2 py-[2px] rounded-full bg-muted/60 hover:bg-muted transition"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* DATE */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDate(bookmark.createdAt)}
        </div>
      </CardFooter>
    </Card>
  )
}