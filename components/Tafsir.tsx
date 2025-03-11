"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TafsirProps {
  surahNumber: number
  ayahNumber: number
}

export function Tafsir({ surahNumber, ayahNumber }: TafsirProps) {
  const [tafsir, setTafsir] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  const fetchTafsir = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.quran.com/api/v4/tafsirs/en-tafsir-ibn-kathir?verse_key=${surahNumber}:${ayahNumber}`,
      )
      const data = await response.json()
      setTafsir(data.tafsirs[0]?.text)
    } catch (err) {
      setError("Failed to fetch tafsir")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (expanded && !tafsir && !loading) {
      fetchTafsir()
    }
  }, [expanded, tafsir, loading])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tafsir</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      {expanded && (
        <CardContent>
          {loading && <p>Loading tafsir...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {tafsir && (
            <ScrollArea className="h-[200px]">
              <p className="text-sm">{tafsir}</p>
            </ScrollArea>
          )}
        </CardContent>
      )}
    </Card>
  )
}

