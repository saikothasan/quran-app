"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { useQuranData } from "@/hooks/useQuranData"
import { useAppContext } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"

export default function BookmarksPage() {
  const { surahs } = useQuranData()
  const { settings, bookmarks, removeBookmark } = useAppContext()

  return (
    <div className={`flex flex-col min-h-screen bg-background text-${settings.fontSize}`}>
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-medium">Bookmarks</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-150px)]">
              {bookmarks.length > 0 ? (
                <div className="divide-y">
                  {bookmarks.map((bookmark, index) => {
                    const surah = surahs.find((s) => s.number === bookmark.surahNumber)
                    const ayah = surah?.ayahs.find((a) => a.numberInSurah === bookmark.ayahNumber)

                    return (
                      <div key={index} className="p-4 flex justify-between items-start">
                        <Link
                          href={`/surah/${bookmark.surahNumber}#ayah-${bookmark.ayahNumber}`}
                          className="flex-1 hover:bg-accent transition-colors"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{surah?.englishName}</span>
                            <span className="text-sm text-muted-foreground">Verse {bookmark.ayahNumber}</span>
                          </div>
                          <p className={`text-right text-lg leading-loose font-${settings.arabicFont} mb-2`}>
                            {ayah?.text}
                          </p>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex justify-center items-center h-full text-muted-foreground">No bookmarks yet</div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

