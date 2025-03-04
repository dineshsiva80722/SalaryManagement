import { getCourse, getMonthlyBatches } from '@/lib/api'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface BatchDetailsProps {
  params: {
    courseId: string
    month: string
    batch: string
  }
}

export default async function BatchDetails({ params }: BatchDetailsProps) {
  const course = await getCourse(params.courseId)
  if (!course) {
    notFound()
  }

  const batches = await getMonthlyBatches(params.courseId, params.month)
  const batch = batches.find(b => b.id === params.batch)
  if (!batch) {
    notFound()
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {course.name} - {monthNames[parseInt(params.month) - 1]} - {batch.name}
      </h1>
      <div className="grid gap-4">
        {batch.courses.map((course, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="font-semibold">Lecture:</dt>
                <dd>{course.lectureName}</dd>
                
                <dt className="font-semibold">Work Status:</dt>
                <dd><Badge>{course.workStatus}</Badge></dd>
                
                <dt className="font-semibold">Payment Status:</dt>
                <dd><Badge variant={course.paymentStatus === 'Done' ? 'default' : 'secondary'}>{course.paymentStatus}</Badge></dd>
                
                <dt className="font-semibold">Salary:</dt>
                <dd>${course.salary}</dd>
                
                <dt className="font-semibold">Paid Amount:</dt>
                <dd>${course.paidAmount}</dd>
                
                <dt className="font-semibold">Pending Amount:</dt>
                <dd>${course.salary - course.paidAmount}</dd>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href={`/course/${params.courseId}/${params.month}`}>Back to Monthly Batches</Link>
        </Button>
        <Button asChild>
          <Link href={`/course/${params.courseId}`}>Back to Course Calendar</Link>
        </Button>
      </div>
    </div>
  )
}

