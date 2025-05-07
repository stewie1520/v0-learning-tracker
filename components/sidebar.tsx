"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Calendar, Github, Home, Lightbulb, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Scheduled", href: "/scheduled", icon: Calendar },
    { name: "Add Resource", href: "/add", icon: Layers },
  ]

  const categories = [
    { name: "GitHub Repos", href: "/?category=github", icon: Github },
    { name: "Books", href: "/?category=book", icon: BookOpen },
    { name: "Courses", href: "/?category=course", icon: BookOpen },
    { name: "Ideas", href: "/?category=idea", icon: Lightbulb },
  ]

  return (
    <div className="hidden md:flex flex-col w-64 bg-card border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold">DevTracker</h2>
        <p className="text-sm text-muted-foreground">Organize your learning journey</p>
      </div>

      <div className="flex-1 px-4 space-y-6">
        <nav className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2 px-2">Navigation</p>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <nav className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2 px-2">Categories</p>
          {categories.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-medium">D</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Developer</p>
            <p className="text-xs text-muted-foreground">Learning Mode</p>
          </div>
        </div>
      </div>
    </div>
  )
}
