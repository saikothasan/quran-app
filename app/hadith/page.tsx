"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { useAppContext } from "@/contexts/AppContext"

interface Hadith {
  id: number
  title: string
  text: string
}

export default function HadithPage() {
  const [hadiths, setHadiths] = useState<Hadith[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { settings } = useAppContext()

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const dummyHadiths: Hadith[] = [
      {
        id: 1,
        title: "The importance of intentions",
        text: "Actions are according to intentions, and everyone will get what was intended...",
      },
      {
        id: 2,
        title: "The best of you",
        text: "The best of you are those who learn the Quran and teach it to others.",
      },
      { id: 3, title: "Kindness", text: "Kindness is a mark of faith, and whoever is not kind has no faith." },
      // Add more hadiths here
    ]
    setHadiths(dummyHadiths)
  }, [])

  const filteredHadiths = hadiths.filter(
    (hadith) =>
      hadith.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hadith.text.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={`flex flex-col min-h-screen bg-background text-${settings.fontSize}`}>
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-medium">Hadiths</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex space-x-2 mb-4">
          <Input
            type="search"
            placeholder="Search hadiths..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              {filteredHadiths.map((hadith) => (
                <div key={hadith.id} className="p-4 border-b last:border-b-0">
                  <h2 className="text-lg font-medium mb-2">{hadith.title}</h2>
                  <p className="text-muted-foreground">{hadith.text}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

