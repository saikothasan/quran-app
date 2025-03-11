"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuranData } from "@/hooks/useQuranData"
import { useAppContext } from "@/contexts/AppContext"

interface DailyVerse {
  surah: {
    number: number
    name: string
    englishName: string
  }
  ayah: {
    number: number
    text: string
    translation?: string
  }
}

export function DailyVerse() {
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null)
  const { surahs, loading } = useQuranData()
  const { settings } = useAppContext()

  useEffect(() => {
    const getRandomVerse = (): DailyVerse | null => {
      if (surahs.length === 0) return null

      const randomSurah = surahs[Math.floor(Math.random() * surahs.length)]
      if (!randomSurah || !randomSurah.ayahs || randomSurah.ayahs.length === 0) return null

      const randomAyah = randomSurah.ayahs[Math.floor(Math.random() * randomSurah.ayahs.length)]
      return {
        surah: {
          number: randomSurah.number,
          name: randomSurah.name,
          englishName: randomSurah.englishName,
        },
        ayah: {
          number: randomAyah.numberInSurah,
          text: randomAyah.text,
          translation: randomAyah.translation?.text,
        },
      }
    }

    const storedVerse = localStorage.getItem("dailyVerse")
    const storedDate = localStorage.getItem("dailyVerseDate")

    if (storedVerse && storedDate && new Date(storedDate).toDateString() === new Date().toDateString()) {
      setDailyVerse(JSON.parse(storedVerse))
    } else if (!loading && surahs.length > 0) {
      const newVerse = getRandomVerse()
      if (newVerse) {
        setDailyVerse(newVerse)
        localStorage.setItem("dailyVerse", JSON.stringify(newVerse))
        localStorage.setItem("dailyVerseDate", new Date().toISOString())
      }
    }
  }, [surahs, loading])

  if (loading || !dailyVerse) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verse of the Day</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-right text-xl leading-loose font-${settings.arabicFont} mb-2`}>{dailyVerse.ayah.text}</p>
        <p className="text-sm text-muted-foreground mb-2">{dailyVerse.ayah.translation}</p>
        <p className="text-sm font-medium">
          {dailyVerse.surah.englishName} ({dailyVerse.surah.name}) - Verse {dailyVerse.ayah.number}
        </p>
      </CardContent>
    </Card>
  )
}

