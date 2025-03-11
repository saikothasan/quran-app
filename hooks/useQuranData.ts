"use client"

import { useState, useEffect, useCallback } from "react"
import { useAppContext } from "@/contexts/AppContext"
import { openDB } from "idb"

interface Ayah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean
  words: {
    text: string
    translation: string
    transliteration: string
  }[]
}

interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
  ayahs: Ayah[]
}

export const useQuranData = (surahNumber?: number) => {
  const { settings } = useAppContext()
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null)
  const [translations, setTranslations] = useState<{ text: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const fetchSurahs = useCallback(async () => {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah?page=${page}`)
      const data = await response.json()
      if (data.code === 200) {
        setSurahs((prevSurahs) => [...prevSurahs, ...data.data])
        setHasMore(data.data.length === 10) // Assuming 10 surahs per page
        setPage((prevPage) => prevPage + 1)
      } else {
        setError("Failed to fetch surahs")
      }
    } catch (err) {
      setError("Error connecting to the API")
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchSurahs()
  }, [fetchSurahs])

  useEffect(() => {
    if (surahNumber) {
      const fetchSurahAndTranslation = async () => {
        setLoading(true)
        try {
          const [surahResponse, translationResponse] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${settings.defaultTranslation}`),
          ])

          const surahData = await surahResponse.json()
          const translationData = await translationResponse.json()

          if (surahData.code === 200 && translationData.code === 200) {
            setCurrentSurah(surahData.data)
            setTranslations(translationData.data.ayahs)

            // Save to IndexedDB for offline access
            if (settings.downloadEnabled) {
              const db = await openDB("QuranApp", 1, {
                upgrade(db) {
                  db.createObjectStore("surahs")
                  db.createObjectStore("translations")
                },
              })
              await db.put("surahs", surahData.data, surahNumber.toString())
              await db.put("translations", translationData.data.ayahs, `${surahNumber}-${settings.defaultTranslation}`)
            }
          } else {
            setError("Failed to fetch surah data")
          }
        } catch (err) {
          setError("Error connecting to the API")

          // Try to load from IndexedDB if offline
          if (settings.downloadEnabled) {
            try {
              const db = await openDB("QuranApp", 1)
              const offlineSurah = await db.get("surahs", surahNumber.toString())
              const offlineTranslation = await db.get("translations", `${surahNumber}-${settings.defaultTranslation}`)
              if (offlineSurah && offlineTranslation) {
                setCurrentSurah(offlineSurah)
                setTranslations(offlineTranslation)
                setError(null)
              }
            } catch (dbErr) {
              console.error("Error accessing offline data:", dbErr)
            }
          }
        } finally {
          setLoading(false)
        }
      }

      fetchSurahAndTranslation()
    }
  }, [surahNumber, settings.defaultTranslation, settings.downloadEnabled])

  return { surahs, currentSurah, translations, loading, error, hasMore, fetchSurahs }
}

