"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft } from "lucide-react"
import { getLecturerMonths } from "@/lib/api"
import LecturerBatchSelector from "./LecturerBatchSelector"

interface LecturerMonthSelectorProps {
  courseId: string
  year: number
  onBack: () => void
}

export default function LecturerMonthSelector({ courseId, year, onBack }: LecturerMonthSelectorProps) {
  const [months, setMonths] = useState<number[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLecturerMonths()
  }, [courseId, year])

  const fetchLecturerMonths = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedMonths = await getLecturerMonths(courseId)
      setMonths(fetchedMonths)
    } catch (err) {
      console.error("Error fetching lecturer months:", err)
      setError("Failed to fetch months. Please try again.")
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
        <Button onClick={fetchLecturerMonths} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  if (selectedMonth) {
    return (
      <LecturerBatchSelector
        courseId={courseId}
        year={year}
        month={selectedMonth}
        onBack={() => setSelectedMonth(null)}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Select Month for {year}</h2>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {months.map((month) => (
          <Button key={month} onClick={() => setSelectedMonth(month)} variant="outline">
            {new Date(year, month - 1).toLocaleString("default", { month: "long" })}
          </Button>
        ))}
      </div>
    </div>
  )
}

