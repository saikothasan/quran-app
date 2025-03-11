"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"
type FontSize = "small" | "medium" | "large" | "x-large"
type ArabicFont = "uthmani" | "scheherazade" | "naskh"

interface Settings {
  theme: Theme
  fontSize: FontSize
  arabicFont: ArabicFont
  defaultTranslation: string
  downloadEnabled: boolean
}

interface Bookmark {
  surahNumber: number
  ayahNumber: number
  timestamp: number
}

interface AppContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  bookmarks: Bookmark[]
  addBookmark: (bookmark: Bookmark) => void
  removeBookmark: (surahNumber: number, ayahNumber: number) => void
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    theme: "system",
    fontSize: "medium",
    arabicFont: "uthmani",
    defaultTranslation: "en.sahih",
    downloadEnabled: false,
  })

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("quranAppSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem("quranAppBookmarks")
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks))
    }
  }, [])

  useEffect(() => {
    // Save settings to localStorage whenever they change
    localStorage.setItem("quranAppSettings", JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    // Save bookmarks to localStorage whenever they change
    localStorage.setItem("quranAppBookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
  }

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarks((prevBookmarks) => [...prevBookmarks, bookmark])
  }

  const removeBookmark = (surahNumber: number, ayahNumber: number) => {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.filter((bookmark) => bookmark.surahNumber !== surahNumber || bookmark.ayahNumber !== ayahNumber),
    )
  }

  const isBookmarked = (surahNumber: number, ayahNumber: number) => {
    return bookmarks.some((bookmark) => bookmark.surahNumber === surahNumber && bookmark.ayahNumber === ayahNumber)
  }

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

