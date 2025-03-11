"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { useQuranData } from "@/hooks/useQuranData"
import { useAppContext } from "@/contexts/AppContext"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const { surahs } = useQuranData()
  const { settings } = useAppContext()

  const handleSearch = async () => {
    // In a real application, you would typically use a backend API for full-text search
    // This is a simple client-side search for demonstration purposes
    const results = surahs.flatMap((surah) =>
      surah.ayahs
        .filter(
          (ayah) =>
            ayah.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ayah.translation?.text.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .map((ayah) => ({
          surahNumber: surah.number,
          surahName: surah.englishName,
          ayahNumber: ayah.numberInSurah,
          arabicText: ayah.text,
          translationText: ayah.translation?.text,
        })),
    )
    setSearchResults(results)
  }

  return (
    <div className={`flex flex-col min-h-screen bg-background text-${settings.fontSize}`}>
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-medium">Search</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex space-x-2 mb-4">
          <Input
            type="search"
            placeholder="Search the Quran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {searchResults.length > 0 ? (
                <div className="divide-y">
                  {searchResults.map((result, index) => (
                    <Link
                      key={index}
                      href={`/surah/${result.surahNumber}#ayah-${result.ayahNumber}`}
                      className="block p-4 hover:bg-accent transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{result.surahName}</span>
                        <span className="text-sm text-muted-foreground">Verse {result.ayahNumber}</span>
                      </div>
                      <p className={`text-right text-lg leading-loose font-${settings.arabicFont} mb-2`}>
                        {result.arabicText}
                      </p>
                      <p className="text-sm text-muted-foreground">{result.translationText}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  {searchTerm ? "No results found" : "Enter a search term to begin"}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

