"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Loader2, LinkIcon } from 'lucide-react'

interface AddBookmarkModalProps {
  onAddBookmark: (bookmark: {
    url: string
    tags: string[]
    customSummary?: string
  }) => Promise<void>
}

export function AddBookmarkModal({ onAddBookmark }: AddBookmarkModalProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [customSummary, setCustomSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) return

    setIsLoading(true)
    
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      await onAddBookmark({
        url: url.trim(),
        tags: tagsArray,
        customSummary: customSummary.trim() || undefined
      })

      // Reset form
      setUrl('')
      setTags('')
      setCustomSummary('')
      setOpen(false)
    } catch (error) {
      console.error('Error adding bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Bookmark</DialogTitle>
          <DialogDescription>
            Save a link with automatic summary generation. We'll fetch the title and favicon for you.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            {url && !isValidUrl(url) && (
              <p className="text-sm text-destructive">Please enter a valid URL</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="technology, ai, programming (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple tags with commas
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customSummary">Custom Summary (Optional)</Label>
            <Textarea
              id="customSummary"
              placeholder="Add your own summary or notes about this link..."
              value={customSummary}
              onChange={(e) => setCustomSummary(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to auto-generate summary using Jina AI
            </p>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !url.trim() || !isValidUrl(url)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Bookmark'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
