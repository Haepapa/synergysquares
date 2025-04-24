"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"
import { toast } from "sonner"
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

interface AccountDialogProps {
  onClose: () => void
}

export default function AccountDialog({ onClose }: AccountDialogProps) {
  const { user, updateUser, logout, deleteAccount } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleUpdateProfile = () => {
    if (!name.trim()) {
      toast.error("Invalid name", {
        description: "Please enter a valid name.",
      })
      return
    }

    updateUser({ name })
    toast.success("Profile updated", {
      description: "Your profile has been updated successfully.",
    })
  }

  const handleLogout = () => {
    logout()
    onClose()
    toast.success("Logged out", {
      description: "You have been logged out successfully.",
    })
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    setShowDeleteConfirm(false)
    onClose()
    toast.success("Account deleted", {
      description: "Your account has been deleted successfully.",
    })
  }

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>Manage your account preferences and information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>

            {user?.email && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} readOnly disabled />
              </div>
            )}

            <div className="pt-4 border-t">
              <Button onClick={handleUpdateProfile} className="w-full bg-accent hover:bg-accent/90">
                Update Profile
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleLogout} className="flex-1 btn-hover-effect">
                Logout
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="flex-1">
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-hover-effect">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
