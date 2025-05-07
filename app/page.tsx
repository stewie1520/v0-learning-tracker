import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ResourceGrid } from "@/components/resource-grid"

export const metadata: Metadata = {
  title: "Learning Resource Tracker",
  description: "Track and schedule your learning resources",
}

export default function HomePage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Resources</h1>
          <p className="text-muted-foreground">Track and schedule your learning journey</p>
        </div>
        <Link href="/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="text-center py-10">Loading resources...</div>}>
        <ResourceGrid />
      </Suspense>
    </div>
  )
}
