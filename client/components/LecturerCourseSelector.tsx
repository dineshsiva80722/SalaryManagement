"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import LecturerYearSelector from "./LecturerYearSelector"

interface LecturerCourseSelectorProps {
  courses: { id: string; name: string }[]
}

export default function LecturerCourseSelector({ courses }: LecturerCourseSelectorProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  if (selectedCourse) {
    return <LecturerYearSelector courseId={selectedCourse} onBack={() => setSelectedCourse(null)} />
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select a Course</h2>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Button key={course.id} onClick={() => setSelectedCourse(course.id)} variant="outline">
              {course.name}
            </Button>
          ))}
        </div>
      ) : (
        <p>No courses available. Please contact an administrator.</p>
      )}
    </div>
  )
}

