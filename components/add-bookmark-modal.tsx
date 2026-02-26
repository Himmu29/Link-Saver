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
import { Plus, Loader2, LinkIcon, Sparkles } from 'lucide-react'

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
        <Button className="gap-2 shadow-sm hover:shadow-md transition">
          <Plus className="h-4 w-4" />
          Add Bookmark
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] rounded-2xl p-6">
        {/* Header */}
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Add New Bookmark
            </DialogTitle>
          </div>

          <DialogDescription className="text-sm text-muted-foreground">
            Save a link and we’ll auto-generate a clean summary, title and icon for you.
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 focus-visible:ring-2 focus-visible:ring-primary"
                required
              />
            </div>

            {url && !isValidUrl(url) && (
              <p className="text-xs text-red-500">
                Please enter a valid URL
              </p>
            )}
          </div>

          {/* TAGS */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="ai, productivity, design"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags using commas
            </p>
          </div>

          {/* SUMMARY */}
          <div className="space-y-2">
            <Label htmlFor="customSummary">Custom Summary</Label>
            <Textarea
              id="customSummary"
              placeholder="Write your own notes or leave blank for AI summary..."
              value={customSummary}
              onChange={(e) => setCustomSummary(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              If empty, summary will be generated using AI
            </p>
          </div>

          {/* FOOTER */}
          <DialogFooter className="pt-2">
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
              className="min-w-[140px]"
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