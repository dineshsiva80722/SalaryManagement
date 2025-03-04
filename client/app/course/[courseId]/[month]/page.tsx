import { getCourse, getMonthlyBatches } from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'

export default async function MonthlyBatches({ params }: { params: { courseId: string; month: string } }) {
  const course = await getCourse(params.courseId)
  if (!course) {
    notFound()
  }

  const batches = await getMonthlyBatches(params.courseId, params.month)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {course.name} - {monthNames[parseInt(params.month) - 1]} Batches
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map((batch) => (
          <Card key={batch.id}>
            <CardHeader>
              <CardTitle>{batch.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Courses: {batch.courses.length}</p>
              <Button asChild className="mt-4">
                <Link href={`/course/${params.courseId}/${params.month}/${batch.id}`}>
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {batches.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No batches found for this month.</p>
      )}
      <div className="mt-8">
        <Button asChild>
          <Link href={`/course/${params.courseId}`}>Back to Course Calendar</Link>
        </Button>
      </div>
    </div>
  )
}

