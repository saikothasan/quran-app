"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2 } from "lucide-react"

interface Collection {
  id: string
  name: string
  verses: { surah: number; ayah: number }[]
}

export function CustomCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [newCollectionName, setNewCollectionName] = useState("")

  useEffect(() => {
    const savedCollections = localStorage.getItem("quranCustomCollections")
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections))
    }
  }, [])

  const saveCollections = (updatedCollections: Collection[]) => {
    localStorage.setItem("quranCustomCollections", JSON.stringify(updatedCollections))
    setCollections(updatedCollections)
  }

  const addCollection = () => {
    if (newCollectionName) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName,
        verses: [],
      }
      saveCollections([...collections, newCollection])
      setNewCollectionName("")
    }
  }

  const deleteCollection = (id: string) => {
    const updatedCollections = collections.filter((collection) => collection.id !== id)
    saveCollections(updatedCollections)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="New collection name"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <Button onClick={addCollection}>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
        <ScrollArea className="h-[200px]">
          {collections.map((collection) => (
            <div key={collection.id} className="flex justify-between items-center p-2 hover:bg-accent">
              <span>
                {collection.name} ({collection.verses.length} verses)
              </span>
              <Button variant="ghost" size="sm" onClick={() => deleteCollection(collection.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

