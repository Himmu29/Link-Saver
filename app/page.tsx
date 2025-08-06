"use client"

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { BookmarkCard } from '@/components/bookmark-card'
import { AddBookmarkModal } from '@/components/add-bookmark-modal'
import { BookmarkFilters } from '@/components/bookmark-filters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bookmark, Plus, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { logOut } from '@/lib/auth'
import { Bookmark as BookmarkType } from '@/lib/supabase'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Fetch bookmarks when user is authenticated
  useEffect(() => {
    if (user && !loading) {
      fetchBookmarks()
    }
  }, [user, loading])

  const fetchBookmarks = async () => {
    if (!user?.uid) return
    
    try {
      setIsFetching(true)
      const response = await fetch(`/api/bookmarks?userId=${user.uid}`)
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks')
      }
      const data = await response.json()
      setBookmarks(data)
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setIsFetching(false)
    }
  }

  // Get all available tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    bookmarks.forEach(bookmark => {
      bookmark.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [bookmarks])

  // Filter bookmarks based on search and tags
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bookmark => {
      const matchesSearch = searchQuery === '' || 
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => bookmark.tags.includes(tag))

      return matchesSearch && matchesTags
    })
  }, [bookmarks, searchQuery, selectedTags])

  const handleAddBookmark = async (newBookmark: {
    url: string
    tags: string[]
    customSummary?: string
  }) => {
    if (!user?.uid) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBookmark,
          userId: user.uid
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add bookmark')
      }

      const addedBookmark = await response.json()
      setBookmarks(prev => [addedBookmark, ...prev])
    } catch (error) {
      console.error('Error adding bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    if (!user?.uid) return
    
    try {
      const response = await fetch(`/api/bookmarks?id=${id}&userId=${user.uid}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete bookmark')
      }

      setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id))
    } catch (error) {
      console.error('Error deleting bookmark:', error)
    }
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleClearFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
  }

  const handleLogout = async () => {
    try {
      await logOut()
      router.push('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading || isFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={{
          email: user.email || '',
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined
        }} 
        onLogout={handleLogout} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Bookmarks</h1>
            <p className="text-muted-foreground">
              {bookmarks.length} saved {bookmarks.length === 1 ? 'link' : 'links'}
            </p>
          </div>
          <AddBookmarkModal onAddBookmark={handleAddBookmark} />
        </div>

        {bookmarks.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
              <p className="text-muted-foreground mb-6">
                Start building your reading list by adding your first bookmark.
              </p>
              <AddBookmarkModal onAddBookmark={handleAddBookmark} />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <BookmarkFilters
                availableTags={availableTags}
                selectedTags={selectedTags}
                searchQuery={searchQuery}
                onTagToggle={handleTagToggle}
                onSearchChange={setSearchQuery}
                onClearFilters={handleClearFilters}
              />
            </div>

            {filteredBookmarks.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-muted-foreground">
                    No bookmarks match your current filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={{
                      id: bookmark.id,
                      url: bookmark.url,
                      title: bookmark.title,
                      summary: bookmark.summary,
                      favicon: bookmark.favicon,
                      tags: bookmark.tags,
                      createdAt: new Date(bookmark.created_at)
                    }}
                    onDelete={handleDeleteBookmark}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
