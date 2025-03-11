"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

interface IslamicDate {
  day: number
  month: number
  year: number
}

export function IslamicCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [islamicDate, setIslamicDate] = useState<IslamicDate | null>(null)

  useEffect(() => {
    if (selectedDate) {
      fetchIslamicDate(selectedDate)
    }
  }, [selectedDate])

  const fetchIslamicDate = async (date: Date) => {
    try {
      const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${date.toISOString().split("T")[0]}`)
      const data = await response.json()
      setIslamicDate({
        day: data.data.hijri.day,
        month: data.data.hijri.month.number,
        year: data.data.hijri.year,
      })
    } catch (error) {
      console.error("Error fetching Islamic date:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Islamic Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
        {islamicDate && (
          <div className="mt-4 text-center">
            <p>Islamic Date:</p>
            <p className="font-bold">{`${islamicDate.day}/${islamicDate.month}/${islamicDate.year} AH`}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

