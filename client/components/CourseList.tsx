'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getCourses, type Course } from '@/lib/api'
import CourseCard from './CourseCard'

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchedCourses = await getCourses()
      setCourses(fetchedCourses)
    }
    fetchCourses()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} isAdmin={user?.role === 'admin'} />
      ))}
    </div>
  )
}
