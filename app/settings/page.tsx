"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useAppContext } from "@/contexts/AppContext"

export default function SettingsPage() {
  const { settings, updateSettings } = useAppContext()

  return (
    <div className={`flex flex-col min-h-screen bg-background text-${settings.fontSize}`}>
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-medium">Settings</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="grid gap-4 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <RadioGroup
                  id="theme"
                  value={settings.theme}
                  onValueChange={(value) => updateSettings({ theme: value })}
                  className="grid grid-cols-3 gap-2"
                >
                  <div>
                    <RadioGroupItem value="light" id="light" className="sr-only" />
                    <Label
                      htmlFor="light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <Sun className="mb-2 h-6 w-6" />
                      Light
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <Label
                      htmlFor="dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <Moon className="mb-2 h-6 w-6" />
                      Dark
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="system" id="system" className="sr-only" />
                    <Label
                      htmlFor="system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full border-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                      </div>
                      System
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select value={settings.fontSize} onValueChange={(value) => updateSettings({ fontSize: value })}>
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="x-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="arabic-font">Arabic Font</Label>
                <Select value={settings.arabicFont} onValueChange={(value) => updateSettings({ arabicFont: value })}>
                  <SelectTrigger id="arabic-font">
                    <SelectValue placeholder="Select Arabic font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uthmani">Uthmani</SelectItem>
                    <SelectItem value="scheherazade">Scheherazade</SelectItem>
                    <SelectItem value="naskh">Naskh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reading Preferences</CardTitle>
              <CardDescription>Customize your reading experience</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="default-translation">Default Translation</Label>
                <Select
                  value={settings.defaultTranslation}
                  onValueChange={(value) => updateSettings({ defaultTranslation: value })}
                >
                  <SelectTrigger id="default-translation">
                    <SelectValue placeholder="Select default translation" />
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
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="download-mode">Download Mode</Label>
                <Switch
                  id="download-mode"
                  checked={settings.downloadEnabled}
                  onCheckedChange={(checked) => updateSettings({ downloadEnabled: checked })}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                Download Mode allows you to save Quran text, translations, and audio for offline use.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>Information about the app</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <p className="text-sm">Quran App v1.0.0</p>
              <p className="text-sm text-muted-foreground">
                This app uses the AlQuran Cloud API for Quran text, translations, and audio.
              </p>
              <p className="text-sm text-muted-foreground">Audio recitations by Mishary Rashid Alafasy.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

