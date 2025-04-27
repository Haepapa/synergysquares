"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/context/auth-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Plus, Save, X, FileText } from "lucide-react"

// Define the preset type
export interface Preset {
  id: string
  name: string
  content: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

interface PresetManagerProps {
  open: boolean
  onClose: () => void
  onSelectPreset?: (preset: Preset) => void
}

export default function PresetManager({ open, onClose, onSelectPreset }: PresetManagerProps) {
  const { user } = useAuth()
  const [presets, setPresets] = useState<Preset[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
  const [presetToDelete, setPresetToDelete] = useState<string | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [presetName, setPresetName] = useState("")
  const [presetContent, setPresetContent] = useState("")

  // Fetch presets when component mounts
  useEffect(() => {
    if (open && user) {
      fetchPresets()
    }
  }, [open, user])

  const fetchPresets = async () => {
    setLoading(true)
    try {
      // This would be replaced with actual Appwrite integration
      // For now, we'll use localStorage as a placeholder

      /* 
      // Appwrite integration would look like this:
      import { Client, Databases, Query } from "appwrite"
      
      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('your-project-id')
      
      const databases = new Databases(client)
      
      const response = await databases.listDocuments(
        'your-database-id',
        'presets',
        [Query.equal('userId', user.id)]
      )
      
      setPresets(response.documents as Preset[])
      */

      // For demo purposes, we'll use localStorage
      const storedPresets = localStorage.getItem("bingo-user-presets")
      const userPresets = storedPresets ? JSON.parse(storedPresets) : {}

      if (user && user.id in userPresets) {
        setPresets(userPresets[user.id])
      } else {
        setPresets([])
      }
    } catch (error) {
      console.error("Failed to fetch presets:", error)
      toast.error("Failed to load presets", {
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePreset = () => {
    setEditingPreset(null)
    setPresetName("")
    setPresetContent("")
    setShowEditDialog(true)
  }

  const handleEditPreset = (preset: Preset) => {
    setEditingPreset(preset)
    setPresetName(preset.name)
    setPresetContent(preset.content.join("\n"))
    setShowEditDialog(true)
  }

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      toast.error("Preset name is required")
      return
    }

    if (!presetContent.trim()) {
      toast.error("Preset content is required")
      return
    }

    const contentArray = presetContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (contentArray.length === 0) {
      toast.error("Preset must contain at least one item")
      return
    }

    try {
      const now = new Date().toISOString()

      if (editingPreset) {
        // Update existing preset
        const updatedPreset: Preset = {
          ...editingPreset,
          name: presetName,
          content: contentArray,
          updatedAt: now,
        }

        /* 
        // Appwrite integration for updating:
        await databases.updateDocument(
          'your-database-id',
          'presets',
          editingPreset.id,
          {
            name: presetName,
            content: contentArray,
            updatedAt: now
          }
        )
        */

        // For demo purposes, update in localStorage
        const updatedPresets = presets.map((p) => (p.id === editingPreset.id ? updatedPreset : p))

        setPresets(updatedPresets)
        savePresetsToLocalStorage(updatedPresets)

        toast.success("Preset updated successfully")
      } else {
        // Create new preset
        const newPreset: Preset = {
          id: `preset_${Date.now()}`,
          name: presetName,
          content: contentArray,
          userId: user?.id || "anonymous",
          createdAt: now,
          updatedAt: now,
        }

        /* 
        // Appwrite integration for creating:
        const response = await databases.createDocument(
          'your-database-id',
          'presets',
          'unique()',
          {
            name: presetName,
            content: contentArray,
            userId: user.id,
            createdAt: now,
            updatedAt: now
          }
        )
        
        const newPreset = response as Preset
        */

        // For demo purposes, save to localStorage
        const updatedPresets = [...presets, newPreset]
        setPresets(updatedPresets)
        savePresetsToLocalStorage(updatedPresets)

        toast.success("Preset created successfully")
      }

      setShowEditDialog(false)
    } catch (error) {
      console.error("Failed to save preset:", error)
      toast.error("Failed to save preset", {
        description: "Please try again later.",
      })
    }
  }

  const handleDeletePreset = async () => {
    if (!presetToDelete) return

    try {
      /* 
      // Appwrite integration for deleting:
      await databases.deleteDocument(
        'your-database-id',
        'presets',
        presetToDelete
      )
      */

      // For demo purposes, remove from localStorage
      const updatedPresets = presets.filter((p) => p.id !== presetToDelete)
      setPresets(updatedPresets)
      savePresetsToLocalStorage(updatedPresets)

      toast.success("Preset deleted successfully")
      setPresetToDelete(null)
    } catch (error) {
      console.error("Failed to delete preset:", error)
      toast.error("Failed to delete preset", {
        description: "Please try again later.",
      })
    }
  }

  const savePresetsToLocalStorage = (updatedPresets: Preset[]) => {
    if (!user) return

    const storedPresets = localStorage.getItem("bingo-user-presets")
    const allPresets = storedPresets ? JSON.parse(storedPresets) : {}

    allPresets[user.id] = updatedPresets
    localStorage.setItem("bingo-user-presets", JSON.stringify(allPresets))
  }

  const handleSelectPreset = (preset: Preset) => {
    if (onSelectPreset) {
      onSelectPreset(preset)
      onClose()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>My Presets</DialogTitle>
            <DialogDescription>Create, edit, and manage your custom bingo presets.</DialogDescription>
          </DialogHeader>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Your Presets</h3>
            <Button
              onClick={handleCreatePreset}
              className={onSelectPreset ? "bg-accent hover:bg-accent/90" : "bg-accent hover:bg-accent/90"}
              size={onSelectPreset ? "sm" : "default"}
            >
              <Plus className="mr-2 h-4 w-4" /> {onSelectPreset ? "New Preset" : "Create New Preset"}
            </Button>
          </div>

          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading your presets...</p>
            </div>
          ) : presets.length === 0 ? (
            <div className="py-8 text-center border rounded-md bg-muted/30">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No presets yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first custom preset to use in your bingo games.
              </p>
              <Button onClick={handleCreatePreset} className="mt-4 bg-accent hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" /> Create Preset
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presets.map((preset) => (
                    <TableRow
                      key={preset.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSelectPreset(preset)}
                    >
                      <TableCell className="font-medium">{preset.name}</TableCell>
                      <TableCell>{preset.content.length} items</TableCell>
                      <TableCell>{new Date(preset.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditPreset(preset)
                            }}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPresetToDelete(preset.id)
                            }}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground">
            <p>Click on a preset to select it for your current game.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit/Create Preset Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPreset ? "Edit Preset" : "Create New Preset"}</DialogTitle>
            <DialogDescription>
              {editingPreset
                ? "Update your preset details and content."
                : "Create a new custom preset for your bingo games."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Enter a name for your preset"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preset-content">Content (one item per line)</Label>
              <Textarea
                id="preset-content"
                value={presetContent}
                onChange={(e) => setPresetContent(e.target.value)}
                placeholder="Enter your bingo items, one per line"
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground">
                Each line will become a separate item on your bingo board.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSavePreset} className="bg-accent hover:bg-accent/90">
              <Save className="mr-2 h-4 w-4" /> {editingPreset ? "Update Preset" : "Save Preset"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!presetToDelete} onOpenChange={(open) => !open && setPresetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Preset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this preset? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePreset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
