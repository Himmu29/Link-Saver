import { NextRequest, NextResponse } from 'next/server'
import { createBookmark, getBookmarksByUserId, deleteBookmark } from '@/lib/bookmarks'

// Placeholder for Jina AI summary generation
async function generateSummary(url: string): Promise<string> {
  try {
    const target = encodeURIComponent(url)
    const response = await fetch(`https://r.jina.ai/http://${target}`, {
      headers: {
        'Accept': 'text/plain',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Jina AI API error: ${response.status}`)
    }
    
    const summary = await response.text()
    return summary.slice(0, 500) + (summary.length > 500 ? '...' : '')
  } catch (error) {
    console.error('Error generating summary:', error)
    return 'Unable to generate summary for this link.'
  }
}

// Placeholder for extracting metadata from URL
async function extractMetadata(url: string) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    
    // Simple regex to extract title - in production, use a proper HTML parser
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname
    
    // Generate favicon URL
    const domain = new URL(url).hostname
    const favicon = `https://www.google.com/s2/favicons?domain=${domain}`
    
    return { title, favicon }
  } catch (error) {
    console.error('Error extracting metadata:', error)
    const domain = new URL(url).hostname
    return {
      title: domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}`
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, tags = [], customSummary, userId } = body
    
    if (!url || !userId) {
      return NextResponse.json(
        { error: 'URL and userId are required' },
        { status: 400 }
      )
    }
    
    // Extract metadata
    const { title, favicon } = await extractMetadata(url)
    
    // Generate summary if not provided
    const summary = customSummary || await generateSummary(url)
    
    // Create bookmark in Supabase
    const bookmark = await createBookmark({
      url,
      title,
      summary,
      favicon,
      tags,
      user_id: userId
    })
    
    return NextResponse.json(bookmark)
  } catch (error) {
    console.error('Error creating bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }
    
    // Fetch bookmarks from Supabase
    const bookmarks = await getBookmarksByUserId(userId)
    
    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    
    if (!id || !userId) {
      return NextResponse.json(
        { error: 'id and userId are required' },
        { status: 400 }
      )
    }
    
    // Delete bookmark from Supabase
    await deleteBookmark(id, userId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    )
  }
}
