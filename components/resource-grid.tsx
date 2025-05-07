"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ResourceCard } from "@/components/resource-card"
import { EmptyState } from "@/components/empty-state"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export type Resource = {
  id: string
  title: string
  description: string
  category: "github" | "book" | "course" | "idea"
  url?: string
  scheduledFor?: string
  createdAt: string
  priority: "low" | "medium" | "high"
}

export function ResourceGrid() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category")
  const [searchQuery, setSearchQuery] = useState("")
  const [resources, setResources] = useState<Resource[]>([])

  // Load resources from localStorage on component mount
  useEffect(() => {
    const savedResources = localStorage.getItem("resources")
    if (savedResources) {
      setResources(JSON.parse(savedResources))
    }
  }, [])

  // Filter resources based on category and search query
  const filteredResources = resources.filter((resource) => {
    const matchesCategory = !categoryFilter || resource.category === categoryFilter
    const matchesSearch =
      !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Group resources by priority
  const highPriority = filteredResources.filter((r) => r.priority === "high")
  const mediumPriority = filteredResources.filter((r) => r.priority === "medium")
  const lowPriority = filteredResources.filter((r) => r.priority === "low")

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
          <TabsTrigger value="medium">Medium Priority</TabsTrigger>
          <TabsTrigger value="low">Low Priority</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="high">
          {highPriority.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highPriority.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState message="No high priority resources found" />
          )}
        </TabsContent>

        <TabsContent value="medium">
          {mediumPriority.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediumPriority.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState message="No medium priority resources found" />
          )}
        </TabsContent>

        <TabsContent value="low">
          {lowPriority.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowPriority.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState message="No low priority resources found" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
