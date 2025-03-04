'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getCourses } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import MonthSelector from '@/components/MonthSelector'
import BatchSelector from '@/components/BatchSelector'
import BatchDetails from '@/components/BatchDetails'

interface Course {
  id: string
  name: string
  description: string
}

export default function UserDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (user.role !== 'user') {
      router.push('/admin/dashboard')
    } else {
      fetchCourses()
    }
  }, [user, router])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const fetchedCourses = await getCourses()
      setCourses(fetchedCourses)
    } catch (err) {
      setError('Failed to fetch courses. Please try again later.')
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId)
    setSelectedMonth(null)
    setSelectedBatch(null)
  }

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month)
    setSelectedBatch(null)
  }

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatch(batchId)
  }

  if (!user || user.role !== 'user') return null

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Button
                    key={course.id}
                    onClick={() => handleCourseSelect(course.id)}
                    variant={selectedCourse === course.id ? "default" : "outline"}
                  >
                    {course.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedCourse && (
            <MonthSelector
              courseId={selectedCourse}
              onSelectMonth={handleMonthSelect}
              selectedMonth={selectedMonth}
            />
          )}

          {selectedCourse && selectedMonth && (
            <BatchSelector
              courseId={selectedCourse}
              month={selectedMonth}
              onSelectBatch={handleBatchSelect}
              selectedBatch={selectedBatch}
            />
          )}

          {selectedCourse && selectedMonth && selectedBatch && (
            <BatchDetails
              courseId={selectedCourse}
              month={selectedMonth}
              batchId={selectedBatch}
            />
          )}
        </div>
      )}
    </main>
  )
}

