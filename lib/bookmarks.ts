import { supabase, Bookmark, CreateBookmarkData } from './supabase'

// Get all bookmarks for a user
export async function getBookmarksByUserId(userId: string): Promise<Bookmark[]> {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
      throw new Error('Failed to fetch bookmarks')
    }

    return data || []
  } catch (error) {
    console.error('Error in getBookmarksByUserId:', error)
    throw error
  }
}

// Create a new bookmark
export async function createBookmark(bookmarkData: CreateBookmarkData): Promise<Bookmark> {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([bookmarkData])
      .select()
      .single()

    if (error) {
      console.error('Error creating bookmark:', error)
      throw new Error('Failed to create bookmark')
    }

    return data
  } catch (error) {
    console.error('Error in createBookmark:', error)
    throw error
  }
}

// Update a bookmark
export async function updateBookmark(id: string, updates: Partial<CreateBookmarkData>): Promise<Bookmark> {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating bookmark:', error)
      throw new Error('Failed to update bookmark')
    }

    return data
  } catch (error) {
    console.error('Error in updateBookmark:', error)
    throw error
  }
}

// Delete a bookmark
export async function deleteBookmark(id: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId) // Ensure user can only delete their own bookmarks

    if (error) {
      console.error('Error deleting bookmark:', error)
      throw new Error('Failed to delete bookmark')
    }
  } catch (error) {
    console.error('Error in deleteBookmark:', error)
    throw error
  }
}

// Search bookmarks by query
export async function searchBookmarks(userId: string, query: string): Promise<Bookmark[]> {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,url.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching bookmarks:', error)
      throw new Error('Failed to search bookmarks')
    }

    return data || []
  } catch (error) {
    console.error('Error in searchBookmarks:', error)
    throw error
  }
}

// Get bookmarks by tags
export async function getBookmarksByTags(userId: string, tags: string[]): Promise<Bookmark[]> {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .contains('tags', tags)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks by tags:', error)
      throw new Error('Failed to fetch bookmarks by tags')
    }

    return data || []
  } catch (error) {
    console.error('Error in getBookmarksByTags:', error)
    throw error
  }
} 