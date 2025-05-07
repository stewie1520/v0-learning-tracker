import type { Metadata } from "next"
import { Suspense } from "react"
import { ScheduledResources } from "@/components/scheduled-resources"

export const metadata: Metadata = {
  title: "Scheduled Resources - Learning Tracker",
  description: "View your scheduled learning resources",
}

export default function ScheduledPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Scheduled Resources</h1>
      <Suspense fallback={<div className="text-center py-10">Loading scheduled resources...</div>}>
        <ScheduledResources />
      </Suspense>
    </div>
  )
}
