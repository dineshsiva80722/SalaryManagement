"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getLecturerBatches } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft } from "lucide-react"
import LecturerBatchDetails from "./LecturerBatchDetails"

interface LecturerBatchSelectorProps {
  courseId: string
  year: number
  month: number
  onBack: () => void
}

interface Batch {
  id: string
  name: string
}

export default function LecturerBatchSelector({ courseId, year, month, onBack }: LecturerBatchSelectorProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user && user.id) {
      fetchLecturerBatches()
    }
  }, [user, courseId, year, month])

  const fetchLecturerBatches = async () => {
    try {
      setLoading(true)
      setError(null)
      if (user && user.id) {
        const fetchedBatches = await getLecturerBatches(user.id, year, month)
        setBatches(fetchedBatches)
      } else {
        throw new Error("User ID not found")
      }
    } catch (err) {
      console.error("Error fetching lecturer batches:", err)
      setError("Failed to fetch batches. Please try again.")
    } finally {
      setLoading(false)
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
        <Button onClick={fetchLecturerBatches} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  if (selectedBatch) {
    return (
      <LecturerBatchDetails
        courseId={courseId}
        year={year}
        month={month}
        batchId={selectedBatch}
        onBack={() => setSelectedBatch(null)}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          Select Batch for {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
        </h2>
      </div>
      {batches.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {batches.map((batch) => (
            <Button key={batch.id} onClick={() => setSelectedBatch(batch.id)} variant="outline">
              {batch.name}
            </Button>
          ))}
        </div>
      ) : (
        <p>No batches available for this month.</p>
      )}
    </div>
  )
}

