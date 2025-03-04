'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import Link from 'next/link'
import { deleteCourse } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface Course {
  id: string;
  name: string;
  description?: string;
}

interface CourseCardProps {
  course: Course;
  isAdmin: boolean;
}

export default function CourseCard({ course, isAdmin }: CourseCardProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(course.id)
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Add any additional course details here */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link href={`/course/${course.id}`}>View Calendar</Link>
        </Button>
        {isAdmin && (
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
