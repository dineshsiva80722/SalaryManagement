"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ChevronLeft } from "lucide-react"
import { getLecturerYears } from "@/lib/api"
import LecturerMonthSelector from "./LecturerMonthSelector"

interface LecturerYearSelectorProps {
  courseId: string
  onBack: () => void
}

export default function LecturerYearSelector({ courseId, onBack }: LecturerYearSelectorProps) {
  const [years, setYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLecturerYears()
  }, [courseId])

  const fetchLecturerYears = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedYears = await getLecturerYears(courseId)
      setYears(fetchedYears)
    } catch (err) {
      console.error("Error fetching lecturer years:", err)
      setError("Failed to fetch years. Please try again.")
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
        <Button onClick={fetchLecturerYears} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  if (selectedYear) {
    return <LecturerMonthSelector courseId={courseId} year={selectedYear} onBack={() => setSelectedYear(null)} />
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Select Year</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {years.map((year) => (
          <Button key={year} onClick={() => setSelectedYear(year)} variant="outline">
            {year}
          </Button>
        ))}
      </div>
    </div>
  )
}

