"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PrayerTime {
  name: string
  time: string
}

export function PrayerTimes() {
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude.toString())
        setLongitude(position.coords.longitude.toString())
      })
    }
  }, [])

  const fetchPrayerTimes = async () => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`,
      )
      const data = await response.json()
      const timings = data.data.timings
      setPrayerTimes([
        { name: "Fajr", time: timings.Fajr },
        { name: "Sunrise", time: timings.Sunrise },
        { name: "Dhuhr", time: timings.Dhuhr },
        { name: "Asr", time: timings.Asr },
        { name: "Maghrib", time: timings.Maghrib },
        { name: "Isha", time: timings.Isha },
      ])
    } catch (error) {
      console.error("Error fetching prayer times:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prayer Times</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          <Input placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
        <Button onClick={fetchPrayerTimes} className="w-full mb-4">
          Get Prayer Times
        </Button>
        {prayerTimes.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {prayerTimes.map((prayer) => (
              <div key={prayer.name} className="flex justify-between">
                <span>{prayer.name}</span>
                <span>{prayer.time}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

