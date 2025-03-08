"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getBatchDetails, updateBatchCourse } from "@/lib/api"
import { Loader2 } from "lucide-react"

function formatINR(amount: number): string {
  return amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  })
}

interface BatchDetailsProps {
  courseId: string
  month: number
  year: number
  batchId: string
}

interface BatchCourse {
  id: string
  name: string
  lectureName: string
  workStatus: string
  paymentStatus: string
  salary: number
  paidAmount: number
  paymentScreenshot?: string
}

export default function BatchDetails({ courseId, month, year, batchId }: BatchDetailsProps) {
  const [batchCourses, setBatchCourses] = useState<BatchCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        setLoading(true)
        const details = await getBatchDetails(courseId, year, month, batchId)
        setBatchCourses(details)
      } catch (err) {
        console.error("Error fetching batch details:", err)
        setError("Failed to fetch batch details. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchBatchDetails()
  }, [courseId, month, year, batchId])

  const handleStatusChange = async (courseIndex: number, field: string, value: string) => {
    try {
      await updateBatchCourse(courseId, batchId, courseIndex, { [field]: value })
      const updatedCourses = [...batchCourses]
      updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], [field]: value }
      setBatchCourses(updatedCourses)
    } catch (err) {
      console.error("Error updating status:", err)
    }
  }

  const handleScreenshotUpload = async (courseIndex: number, screenshotUrl: string) => {
    try {
      await updateBatchCourse(courseId, batchId, courseIndex, {
        paymentScreenshot: screenshotUrl,
        paymentStatus: "Done",
      })
      const updatedCourses = [...batchCourses]
      updatedCourses[courseIndex] = {
        ...updatedCourses[courseIndex],
        paymentScreenshot: screenshotUrl,
        paymentStatus: "Done",
      }
      setBatchCourses(updatedCourses)
    } catch (err) {
      console.error("Error uploading screenshot:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Details</CardTitle>
      </CardHeader>
      <CardContent>
        {batchCourses.map((course, index) => (
          <Card key={course.id} className="mb-4">
            <CardContent className="p-4">
              <h4 className="font-semibold">
                {course.name} - {course.lectureName}
              </h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Work Status</label>
                  <Select
                    value={course.workStatus}
                    onValueChange={(value) => handleStatusChange(index, "workStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select work status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Incomplete">Incomplete</SelectItem>
                      <SelectItem value="Complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                  <Select
                    value={course.paymentStatus}
                    onValueChange={(value) => handleStatusChange(index, "paymentStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <p>Salary: {formatINR(course.salary)}</p>
                <p>Paid Amount: {formatINR(course.paidAmount)}</p>
                <p>Pending Amount: {formatINR(course.salary - course.paidAmount)}</p>
              </div>
              {course.paymentScreenshot && (
                <div className="mt-4">
                  <img
                    src={course.paymentScreenshot || "/placeholder.svg"}
                    alt="Payment Screenshot"
                    className="max-w-xs rounded-md"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
  
      </CardContent>
    </Card>
  )
}
