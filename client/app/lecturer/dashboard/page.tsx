"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { getCourses } from "@/lib/api"
import { Loader2 } from "lucide-react"
import LecturerCourseSelector from "@/components/LecturerCourseSelector"

export default function LecturerDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "lecturer") {
        router.push("/")
      } else {
        await fetchCourses()
      }
    }
    checkAuth()
  }, [user, router])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedCourses = await getCourses()
      setCourses(fetchedCourses.map((course) => ({ id: course.id, name: course.name })))
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError("Failed to fetch courses. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "lecturer") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button onClick={fetchCourses} className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <LecturerCourseSelector courses={courses} />
      )}
    </main>
  )
}

