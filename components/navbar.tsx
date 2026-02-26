"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Moon, Sun, LogOut, User, Bookmark } from 'lucide-react'
import { useTheme } from 'next-themes'

interface NavbarProps {
  user?: {
    email: string
    displayName?: string
    photoURL?: string
  } | null
  onLogout?: () => void
}

export function Navbar({ user, onLogout }: NavbarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-500 text-white shadow-md group-hover:scale-105 transition">
              <Bookmark className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight group-hover:text-primary transition">
              Link Saver
            </span>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* THEME TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative rounded-xl hover:bg-muted/60 transition"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* USER MENU */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/40 transition"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.photoURL || ''}
                        alt={user.displayName || user.email}
                      />
                      <AvatarFallback className="bg-muted">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-60 mt-2 rounded-xl shadow-lg border bg-background/95 backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3 p-3 border-b">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || ''} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight">
                      {user.displayName && (
                        <span className="font-medium text-sm">
                          {user.displayName}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <DropdownMenuItem
                    onClick={onLogout}
                    className="gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="rounded-xl hover:bg-muted/60"
                >
                  <Link href="/login">Login</Link>
                </Button>

                <Button
                  asChild
                  className="rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  )
}