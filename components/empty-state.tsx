import { FolderPlus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message = "No resources found" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FolderPlus className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{message}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Start tracking your learning resources to organize your journey
      </p>
      <Link href="/add" className="mt-4">
        <Button>Add Your First Resource</Button>
      </Link>
    </div>
  )
}
