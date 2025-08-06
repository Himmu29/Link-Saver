"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface BookmarkFiltersProps {
  availableTags: string[]
  selectedTags: string[]
  searchQuery: string
  onTagToggle: (tag: string) => void
  onSearchChange: (query: string) => void
  onClearFilters: () => void
}

export function BookmarkFilters({
  availableTags,
  selectedTags,
  searchQuery,
  onTagToggle,
  onSearchChange,
  onClearFilters
}: BookmarkFiltersProps) {
  const hasActiveFilters = selectedTags.length > 0 || searchQuery.length > 0

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filter by tags</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                  {isSelected && <X className="ml-1 h-3 w-3" />}
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
