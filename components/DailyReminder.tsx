"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"

export function DailyReminder() {
  const [reminderTime, setReminderTime] = useState("")
  const [isReminderSet, setIsReminderSet] = useState(false)

  useEffect(() => {
    const savedReminderTime = localStorage.getItem("quranReminderTime")
    if (savedReminderTime) {
      setReminderTime(savedReminderTime)
      setIsReminderSet(true)
    }
  }, [])

  const setReminder = () => {
    if (reminderTime) {
      localStorage.setItem("quranReminderTime", reminderTime)
      setIsReminderSet(true)

      // Here you would typically set up a push notification or alert
      // For this example, we'll just use an alert
      const [hours, minutes] = reminderTime.split(":")
      const reminderDate = new Date()
      reminderDate.setHours(Number.parseInt(hours))
      reminderDate.setMinutes(Number.parseInt(minutes))

      const now = new Date()
      let delay = reminderDate.getTime() - now.getTime()
      if (delay < 0) {
        delay += 24 * 60 * 60 * 1000 // Add 24 hours if the time has already passed today
      }

      setTimeout(() => {
        alert("It's time for your daily Quran reading!")
      }, delay)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Reminder</CardTitle>
      </CardHeader>
      <CardContent>
        {isReminderSet ? (
          <p>Your daily reminder is set for {reminderTime}</p>
        ) : (
          <div className="flex items-center space-x-2">
            <Input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
            <Button onClick={setReminder}>
              <Bell className="mr-2 h-4 w-4" />
              Set Reminder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

