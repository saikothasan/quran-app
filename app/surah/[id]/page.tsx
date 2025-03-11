"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Bookmark, Play, Pause, Share2 } from "lucide-react"
import Link from "next/link"
import { useQuranData } from "@/hooks/useQuranData"
import { useAppContext } from "@/contexts/AppContext"
import { Tafsir } from "@/components/Tafsir"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import ErrorBoundary from "@/components/ErrorBoundary"

export default function SurahPage({ params }) {
  const { id } = params
  const { currentSurah, translations, loading, error } = useQuranData(Number.parseInt(id))
  const { settings, updateSettings, addBookmark, removeBookmark, isBookmarked } = useAppContext()
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioSrc, setAudioSrc] = useState("")
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [showWordByWord, setShowWordByWord] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (currentSurah) {
      setAudioSrc(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${currentSurah.number}.mp3`)
    }
  }, [currentSurah])

  useEffect(() => {
    if (audioSrc) {
      const audioObj = new Audio(audioSrc)
      audioObj.addEventListener("ended", () => setIsPlaying(false))
      setAudio(audioObj)

      return () => {
        audioObj.pause()
        audioObj.removeEventListener("ended", () => setIsPlaying(false))
      }
    }
  }, [audioSrc])

  useEffect(() => {
    if (audio && canvasRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(audioContext.destination)

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")!
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const draw = () => {
        requestAnimationFrame(draw)
        analyser.getByteFrequencyData(dataArray)
        ctx.fillStyle = "rgb(0, 0, 0)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const barWidth = (canvas.width / bufferLength) * 2.5
        let barHeight
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2
          ctx.fillStyle = `rgb(${barHeight + 100},50,50)`
          ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight)
          x += barWidth + 1
        }
      }

      draw()
    }
  }, [audio])

  const toggleAudio = () => {
    if (isPlaying) {
      audio?.pause()
    } else {
      audio?.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTranslationChange = (value) => {
    updateSettings({ defaultTranslation: value })
  }

  const toggleBookmark = (surahNumber: number, ayahNumber: number) => {
    if (isBookmarked(surahNumber, ayahNumber)) {
      removeBookmark(surahNumber, ayahNumber)
    } else {
      addBookmark({ surahNumber, ayahNumber, timestamp: Date.now() })
    }
  }

  const shareVerse = (surahNumber: number, ayahNumber: number) => {
    const verseText = currentSurah?.ayahs[ayahNumber - 1].text
    const translationText = translations[ayahNumber - 1]?.text
    const shareText = `${verseText}\n\n${translationText}\n\nQuran ${surahNumber}:${ayahNumber}`

    if (navigator.share) {
      navigator.share({
        title: "Share Verse",
        text: shareText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert("Verse copied to clipboard!")
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-destructive">{error}</div>
  }

  return (
    <ErrorBoundary>
      <div className={`flex flex-col min-h-screen bg-background text-${settings.fontSize}`}>
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Link href="/" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-medium">
                {currentSurah?.englishName} ({currentSurah?.name})
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentSurah?.englishNameTranslation} • {currentSurah?.numberOfAyahs} verses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={toggleAudio}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 container py-6">
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {currentSurah?.revelationType} • {currentSurah?.numberOfAyahs} verses
            </div>
            <div className="flex items-center gap-2">
              <Select value={settings.defaultTranslation} onValueChange={handleTranslationChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select translation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en.sahih">Sahih International</SelectItem>
                  <SelectItem value="en.pickthall">Pickthall</SelectItem>
                  <SelectItem value="en.yusufali">Yusuf Ali</SelectItem>
                  <SelectItem value="fr.hamidullah">French</SelectItem>
                  <SelectItem value="es.asad">Spanish</SelectItem>
                  <SelectItem value="de.aburida">German</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setShowWordByWord(!showWordByWord)}>
                {showWordByWord ? "Hide" : "Show"} Word-by-Word
              </Button>
            </div>
          </div>

          <Card className="mb-4">
            <CardContent className="p-0">
              <canvas ref={canvasRef} width="300" height="50" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center py-6 border-b">
              <CardTitle className={`text-2xl font-${settings.arabicFont}`}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</CardTitle>
              <p className="text-muted-foreground mt-2">
                In the name of Allah, the Entirely Merciful, the Especially Merciful
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="divide-y">
                  {currentSurah?.ayahs.map((ayah, index) => {
                    const translation = translations[index]

                    return (
                      <div key={ayah.number} className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">
                            {ayah.numberInSurah}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleBookmark(currentSurah.number, ayah.numberInSurah)}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${isBookmarked(currentSurah.number, ayah.numberInSurah) ? "fill-current" : ""}`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => shareVerse(currentSurah.number, ayah.numberInSurah)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {showWordByWord ? (
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {ayah.words.map((word, wordIndex) => (
                              <div key={wordIndex} className="text-center">
                                <p className={`text-lg font-${settings.arabicFont}`}>{word.text}</p>
                                <p className="text-xs">{word.transliteration}</p>
                                <p className="text-xs text-muted-foreground">{word.translation}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={`text-right text-2xl leading-loose font-${settings.arabicFont} mb-4`}>
                            {ayah.text}
                          </p>
                        )}
                        <p className="text-muted-foreground mb-4">{translation?.text}</p>
                        <Tafsir surahNumber={currentSurah.number} ayahNumber={ayah.numberInSurah} />
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </main>
      </div>
    </ErrorBoundary>
  )
}

