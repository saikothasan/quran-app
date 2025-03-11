"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Compass } from "lucide-react"

export function QiblaFinder() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null)
  const [compassHeading, setCompassHeading] = useState<number | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat1 = position.coords.latitude * (Math.PI / 180)
        const lon1 = position.coords.longitude * (Math.PI / 180)
        const lat2 = 21.422487 * (Math.PI / 180) // Mecca latitude
        const lon2 = 39.826206 * (Math.PI / 180) // Mecca longitude

        const y = Math.sin(lon2 - lon1) * Math.cos(lat2)
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
        let qibla = Math.atan2(y, x)
        qibla = qibla * (180 / Math.PI)
        qibla = (qibla + 360) % 360

        setQiblaDirection(qibla)
      })
    }

    if ("DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation)
    }

    return () => {
      if ("DeviceOrientationEvent" in window) {
        window.removeEventListener("deviceorientation", handleOrientation)
      }
    }
  }, [])

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.webkitCompassHeading) {
      setCompassHeading(event.webkitCompassHeading)
    } else if (event.alpha !== null) {
      setCompassHeading(360 - event.alpha)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Qibla Finder</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {qiblaDirection !== null && compassHeading !== null ? (
          <>
            <Compass className="w-24 h-24 mb-4" style={{ transform: `rotate(${compassHeading}deg)` }} />
            <div className="text-center">
              <p>Qibla Direction: {Math.round(qiblaDirection)}°</p>
              <p>Compass Heading: {Math.round(compassHeading)}°</p>
              <p>Turn {Math.round((qiblaDirection - compassHeading + 360) % 360)}° to face Qibla</p>
            </div>
          </>
        ) : (
          <p>Loading Qibla direction...</p>
        )}
      </CardContent>
    </Card>
  )
}

