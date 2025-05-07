"use client"

import { useState, useEffect } from "react"
import { isToday, isTomorrow, isThisWeek, isAfter } from "date-fns"
import type { Resource } from "./resource-grid"
import { ResourceCard } from "./resource-card"
import { EmptyState } from "./empty-state"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ScheduledResources() {
  const [resources, setResources] = useState<Resource[]>([])

  // Load resources from localStorage on component mount
  useEffect(() => {
    const savedResources = localStorage.getItem("resources")
    if (savedResources) {
      const allResources = JSON.parse(savedResources)
      // Filter only resources that have scheduledFor date
      const scheduledResources = allResources.filter((r: Resource) => r.scheduledFor)
      setResources(scheduledResources)
    }
  }, [])

  // Group resources by time period
  const todayResources = resources.filter((r) => r.scheduledFor && isToday(new Date(r.scheduledFor)))
  const tomorrowResources = resources.filter((r) => r.scheduledFor && isTomorrow(new Date(r.scheduledFor)))
  const thisWeekResources = resources.filter((r) => {
    if (!r.scheduledFor) return false
    const date = new Date(r.scheduledFor)
    return isThisWeek(date) && !isToday(date) && !isTomorrow(date)
  })
  const laterResources = resources.filter((r) => {
    if (!r.scheduledFor) return false
    const date = new Date(r.scheduledFor)
    return isAfter(date, new Date()) && !isThisWeek(date)
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="this-week">This Week</TabsTrigger>
          <TabsTrigger value="later">Later</TabsTrigger>
          <TabsTrigger value="all">All Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          {todayResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState message="No resources scheduled for today" />
          )}
        </TabsContent>

        <TabsContent value="tomorrow">
          {tomorrowResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tomorrowResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState message="No resources scheduled for tomorrow" />
          )}
        </TabsContent>

        <TabsContent value="this-week">
          {thisWeekResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {thisWeekResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState message="No resources scheduled for this week" />
          )}
        </TabsContent>

        <TabsContent value="later">
          {laterResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {laterResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState message="No resources scheduled for later" />
          )}
        </TabsContent>

        <TabsContent value="all">
          {resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState message="No scheduled resources found" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
