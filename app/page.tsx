"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bookmark, BookOpen, Home, Search, Settings } from "lucide-react"
import Link from "next/link"
import { useQuranData } from "@/hooks/useQuranData"
import { useAppContext } from "@/contexts/AppContext"
import { DailyVerse } from "@/components/DailyVerse"
import { PrayerTimes } from "@/components/PrayerTimes"
import { QiblaFinder } from "@/components/QiblaFinder"
import { ProgressTracker } from "@/components/ProgressTracker"
import { IslamicCalendar } from "@/components/IslamicCalendar"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import ErrorBoundary from "@/components/ErrorBoundary"
import { useInView } from "react-intersection-observer"
import { DailyReminder } from "@/components/DailyReminder"
import { CustomCollections } from "@/components/CustomCollections"

export default function QuranApp() {
  const { surahs, loading, error, hasMore, fetchSurahs } = useQuranData()
  const { settings } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [ref, inView] = useInView()

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.number.toString().includes(searchTerm),
  )

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark" ||
        (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches),
    )
  }, [settings.theme])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchSurahs()
    }
  }, [inView, hasMore, loading, fetchSurahs])

  const renderSurahList = useCallback(() => {
    if (loading && surahs.length === 0) {
      return <LoadingSkeleton />
    }

    if (error) {
      return <div className="text-center text-red-500">{error}</div>
    }

    return (
      <>
        {filteredSurahs.map((surah) => (
          <Link
            key={surah.number}
            href={`/surah/${surah.number}`}
            className="flex items-center justify-between p-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                {surah.number}
              </div>
              <div>
                <div className="font-medium">{surah.englishName}</div>
                <div className="text-sm text-muted-foreground">{surah.englishNameTranslation}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-lg">{surah.name}</div>
              <div className="text-sm text-muted-foreground">{surah.numberOfAyahs} verses</div>
            </div>
          </Link>
        ))}
        {hasMore && (
          <div ref={ref} className="flex justify-center p-4">
            <LoadingSkeleton />
          </div>
        )}
      </>
    )
  }, [filteredSurahs, loading, error, hasMore, ref])

  return (
    <ErrorBoundary>
      <div className={`flex flex-col min-h-screen bg-background text-${settings.fontSize}`}>
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6" />
                <span className="font-bold">Quran App</span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <Input
                type="search"
                placeholder="Search..."
                className="md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 container py-6">
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-4">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="surahs">Surahs</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <div className="grid gap-4">
                <DailyVerse />
                <DailyReminder />
                <Link href="/surah/1" className="block">
                  <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg flex justify-between">
                        <span>Continue Reading</span>
                        <span className="text-muted-foreground">Al-Fatihah</span>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="surahs">
              <Card>
                <CardHeader>
                  <CardTitle>Surahs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">{renderSurahList()}</ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tools">
              <div className="grid gap-4">
                <PrayerTimes />
                <QiblaFinder />
              </div>
            </TabsContent>
            <TabsContent value="progress">
              <ProgressTracker />
            </TabsContent>
            <TabsContent value="calendar">
              <IslamicCalendar />
            </TabsContent>
            <TabsContent value="collections">
              <CustomCollections />
            </TabsContent>
          </Tabs>
        </main>

        <footer className="sticky bottom-0 z-10 w-full border-t bg-background">
          <div className="container">
            <nav className="flex justify-between items-center h-16">
              <Link href="/" className="flex flex-col items-center justify-center w-1/5">
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">Home</span>
              </Link>
              <Link href="/search" className="flex flex-col items-center justify-center w-1/5">
                <Search className="h-5 w-5" />
                <span className="text-xs mt-1">Search</span>
              </Link>
              <Link href="/bookmarks" className="flex flex-col items-center justify-center w-1/5">
                <Bookmark className="h-5 w-5" />
                <span className="text-xs mt-1">Bookmarks</span>
              </Link>
              <Link href="/hadith" className="flex flex-col items-center justify-center w-1/5">
                <BookOpen className="h-5 w-5" />
                <span className="text-xs mt-1">Hadith</span>
              </Link>
              <Link href="/settings" className="flex flex-col items-center justify-center w-1/5">
                <Settings className="h-5 w-5" />
                <span className="text-xs mt-1">Settings</span>
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

