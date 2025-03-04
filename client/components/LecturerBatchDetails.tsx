"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { getLecturerBatchDetails, updateLecturerBatchCourse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, ChevronLeft } from "lucide-react"

interface LecturerBatchDetailsProps {
  courseId: string
  year: number
  month: number
  batchId: string
  onBack: () => void
}

type WorkStatus = "Not Started" | "In Progress" | "Incomplete" | "Complete";
type PaymentStatus = "Pending" | "Done";

interface BatchCourse {
  id: string
  name: string
  lectureName: string
  workStatus: WorkStatus
  paymentStatus: PaymentStatus
  salary: number
  paidAmount: number
}

export default function LecturerBatchDetails({ courseId, year, month, batchId, onBack }: LecturerBatchDetailsProps) {
  const [batchCourses, setBatchCourses] = useState<BatchCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  const fetchLecturerBatchDetails = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      if (!user || !user.id) {
        throw new Error("User not authenticated")
      }
      const fetchedBatchCourses = await getLecturerBatchDetails(user.id, batchId)
      setBatchCourses(fetchedBatchCourses)
    } catch (err) {
      console.error("Error fetching lecturer batch details:", err)
      setError("Failed to fetch batch details. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [user, batchId])

  useEffect(() => {
    if (user && user.id) {
      fetchLecturerBatchDetails()
    }
  }, [user, fetchLecturerBatchDetails])

  const handleUpdateBatchCourse = async (courseId: string, updates: Partial<BatchCourse>) => {
    try {
      if (updates.workStatus && !["Not Started", "In Progress", "Incomplete", "Complete"].includes(updates.workStatus as WorkStatus)) {
        setError("Invalid work status value");
        return;
      }

      setIsSubmitting(true)
      setError(null)
      if (!user || !user.id) {
        throw new Error("User not authenticated")
      }
      await updateLecturerBatchCourse(user.id, batchId, courseId, updates)
      setBatchCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, ...updates } : course
        )
      )
    } catch (err) {
      console.error("Error updating batch course:", err)
      setError("Failed to update batch course. Please try again.")
    } finally {
      setIsSubmitting(false)
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
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button onClick={fetchLecturerBatchDetails} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Batch Details</h2>
      </div>
      {batchCourses.length > 0 ? (
        batchCourses.map((course) => (
          <Card key={course.id} className="mb-4">
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label htmlFor={`work-status-${course.id}`}>Work Status</Label>
                  <Select
                    value={course.workStatus}
                    onValueChange={(value) => handleUpdateBatchCourse(course.id, { workStatus: value as WorkStatus })}
                    disabled={isSubmitting}
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
                  <Label htmlFor={`payment-status-${course.id}`}>Payment Status</Label>
                  <Select
                    value={course.paymentStatus}
                    onValueChange={(value) => handleUpdateBatchCourse(course.id, { paymentStatus: value as PaymentStatus })}
                    disabled={isSubmitting}
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
                <div>
                  <Label htmlFor={`salary-${course.id}`}>Salary</Label>
                  <Input id={`salary-${course.id}`} value={course.salary} disabled />
                </div>
                <div>
                  <Label htmlFor={`paid-amount-${course.id}`}>Paid Amount</Label>
                  <Input id={`paid-amount-${course.id}`} value={course.paidAmount} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No courses found for this batch.</p>
      )}
    </div>
  )
}
