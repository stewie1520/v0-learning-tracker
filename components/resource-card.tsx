"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  Github,
  BookOpen,
  Lightbulb,
  Layers,
  MoreVertical,
  Trash2,
  Edit,
  CheckCircle,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Resource } from "./resource-grid"

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)

  const getCategoryIcon = () => {
    switch (resource.category) {
      case "github":
        return <Github className="h-4 w-4" />
      case "book":
        return <BookOpen className="h-4 w-4" />
      case "course":
        return <Layers className="h-4 w-4" />
      case "idea":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <Layers className="h-4 w-4" />
    }
  }

  const getPriorityColor = () => {
    switch (resource.priority) {
      case "high":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20"
    }
  }

  const handleDelete = () => {
    // Get current resources
    const savedResources = localStorage.getItem("resources")
    if (savedResources) {
      const resources = JSON.parse(savedResources)
      // Filter out the resource to delete
      const updatedResources = resources.filter((r: Resource) => r.id !== resource.id)
      // Save back to localStorage
      localStorage.setItem("resources", JSON.stringify(updatedResources))
      // Close dialog and refresh (in a real app, we'd use state management)
      setShowDeleteDialog(false)
      window.location.reload()
    }
  }

  const handleComplete = () => {
    // Get current resources
    const savedResources = localStorage.getItem("resources")
    if (savedResources) {
      const resources = JSON.parse(savedResources)
      // Filter out the completed resource
      const updatedResources = resources.filter((r: Resource) => r.id !== resource.id)
      // Save back to localStorage
      localStorage.setItem("resources", JSON.stringify(updatedResources))

      // Add to completed resources
      const savedCompleted = localStorage.getItem("completedResources") || "[]"
      const completedResources = JSON.parse(savedCompleted)
      completedResources.push({
        ...resource,
        completedAt: new Date().toISOString(),
      })
      localStorage.setItem("completedResources", JSON.stringify(completedResources))

      // Close dialog and refresh
      setShowCompleteDialog(false)
      window.location.reload()
    }
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center space-x-2">
            <div
              className={`p-1.5 rounded-md ${resource.category === "github" ? "bg-purple-500/10" : resource.category === "book" ? "bg-blue-500/10" : resource.category === "course" ? "bg-orange-500/10" : "bg-green-500/10"}`}
            >
              {getCategoryIcon()}
            </div>
            <Badge variant="outline" className={getPriorityColor()}>
              {resource.priority.charAt(0).toUpperCase() + resource.priority.slice(1)}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowCompleteDialog(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Complete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Resource
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <h3 className="font-semibold text-lg line-clamp-1">{resource.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{resource.description}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>Added {formatDistanceToNow(new Date(resource.createdAt))} ago</span>
          </div>

          {resource.scheduledFor && (
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <span>Scheduled for {new Date(resource.scheduledFor).toLocaleDateString()}</span>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{resource.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Confirmation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Complete</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark "{resource.title}" as complete? It will be moved to your completed
              resources.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>Complete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
