"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Github, BookOpen, Layers, Lightbulb } from "lucide-react"
import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  category: z.enum(["github", "book", "course", "idea"]),
  url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  scheduledFor: z.date().optional(),
  priority: z.enum(["low", "medium", "high"]),
})

export function AddResourceForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "github",
      url: "",
      priority: "medium",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Create new resource object
    const newResource = {
      id: uuidv4(),
      ...values,
      createdAt: new Date().toISOString(),
    }

    // Get existing resources from localStorage
    const existingResources = localStorage.getItem("resources")
    const resources = existingResources ? JSON.parse(existingResources) : []

    // Add new resource and save back to localStorage
    resources.push(newResource)
    localStorage.setItem("resources", JSON.stringify(resources))

    // Redirect to home page
    setTimeout(() => {
      router.push("/")
      router.refresh()
    }, 500)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "github":
        return <Github className="h-4 w-4" />
      case "book":
        return <BookOpen className="h-4 w-4" />
      case "course":
        return <Layers className="h-4 w-4" />
      case "idea":
        return <Lightbulb className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="React Hooks Deep Dive" {...field} />
                  </FormControl>
                  <FormDescription>Give your resource a clear, descriptive title</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="github">
                          <div className="flex items-center">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub Repository
                          </div>
                        </SelectItem>
                        <SelectItem value="book">
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Book
                          </div>
                        </SelectItem>
                        <SelectItem value="course">
                          <div className="flex items-center">
                            <Layers className="mr-2 h-4 w-4" />
                            Course
                          </div>
                        </SelectItem>
                        <SelectItem value="idea">
                          <div className="flex items-center">
                            <Lightbulb className="mr-2 h-4 w-4" />
                            Project Idea
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A comprehensive guide to React Hooks with practical examples"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Briefly describe what this resource is about</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} />
                  </FormControl>
                  <FormDescription>Link to the resource if available</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduledFor"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Schedule For (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>When do you plan to work on this resource?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Resource"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
