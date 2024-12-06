'use client'

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, Home, Plus } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Placeholder data - this will be replaced with real data from Supabase
  const recentProjects = [
    { id: 1, name: "Contract A", status: "Signed", date: "2024-03-10" },
    { id: 2, name: "Agreement B", status: "Pending", date: "2024-03-09" },
    { id: 3, name: "Document C", status: "Signed", date: "2024-03-08" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              <span className="font-semibold">Home</span>
            </Link>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Your Projects
            </h2>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-card">
              <div className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">Project</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <tr key={project.id} className="border-b">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            {project.name}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'Signed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {new Date(project.date).toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {recentProjects.length === 0 && (
              <div className="text-center py-12 border rounded-lg">
                <div className="space-y-3">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">No projects yet</h3>
                    <p className="text-muted-foreground">
                      Create your first project to get started
                    </p>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 