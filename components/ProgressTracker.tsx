"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useQuranData } from "@/hooks/useQuranData"
import { useAppContext } from "@/contexts/AppContext"

export function ProgressTracker() {
  const [progress, setProgress] = useState(0)
  const { surahs } = useQuranData()
  const { settings } = useAppContext()

  useEffect(() => {
    const calculateProgress = () => {
      const totalVerses = surahs.reduce((total, surah) => total + surah.numberOfAyahs, 0)
      const readVerses = Number.parseInt(localStorage.getItem("readVerses") || "0")
      const newProgress = (readVerses / totalVerses) * 100
      setProgress(newProgress)
    }

    calculateProgress()
  }, [surahs])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
        <p className="text-center mt-2">{progress.toFixed(2)}% Complete</p>
      </CardContent>
    </Card>
  )
}

