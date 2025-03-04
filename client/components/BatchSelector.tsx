'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMonthlyBatches } from '@/lib/api'

interface BatchSelectorProps {
  courseId: string
  month: number
  onSelectBatch: (batchId: string) => void
  selectedBatch: string | null
}

export default function BatchSelector({ courseId, month, onSelectBatch, selectedBatch }: BatchSelectorProps) {
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const fetchBatches = async () => {
      const fetchedBatches = await getMonthlyBatches(courseId, month.toString())
      setBatches(fetchedBatches)
    }
    fetchBatches()
  }, [courseId, month])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Batch</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {batches.map((batch) => (
            <Button
              key={batch.id}
              onClick={() => onSelectBatch(batch.id)}
              variant={selectedBatch === batch.id ? "default" : "outline"}
            >
              {batch.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

