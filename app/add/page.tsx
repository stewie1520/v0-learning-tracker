import type { Metadata } from "next"
import { AddResourceForm } from "@/components/add-resource-form"

export const metadata: Metadata = {
  title: "Add Resource - Learning Tracker",
  description: "Add a new learning resource to track",
}

export default function AddResourcePage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Add New Resource</h1>
      <div className="max-w-2xl mx-auto">
        <AddResourceForm />
      </div>
    </div>
  )
}
