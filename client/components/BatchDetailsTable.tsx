'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateBatchDetail } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { ScreenshotUploader } from './ScreenshotUploader'
import Image from 'next/image'

interface BatchDetail {
  id: string
  courseName: string
  lectureName: string
  workStatus: 'complete' | 'incomplete'
  paymentStatus: 'done' | 'pending'
  totalSalary: number
  paidSalary: number
  pendingSalary: number
  paymentScreenshot?: string
}

interface BatchDetailsTableProps {
  details: BatchDetail[]
}

export default function BatchDetailsTable({ details: initialDetails }: BatchDetailsTableProps) {
  const [details, setDetails] = useState<BatchDetail[]>(initialDetails)
  const router = useRouter()

  const handleStatusChange = async (id: string, field: 'workStatus' | 'paymentStatus', value: string) => {
    try {
      const updatedDetails = details.map(item => {
        if (item.id === id) {
          const updates: Partial<BatchDetail> = { [field]: value }
          if (field === 'paymentStatus') {
            if (value === 'done') {
              updates.paidSalary = item.totalSalary
              updates.pendingSalary = 0
            } else {
              updates.paidSalary = 0
              updates.pendingSalary = item.totalSalary
            }
          }
          return { ...item, ...updates }
        }
        return item
      })

      setDetails(updatedDetails)

      await updateBatchDetail(id, { [field]: value })
      router.refresh()
    } catch (error) {
      console.error('Failed to update batch detail:', error)
      setDetails(initialDetails)
    }
  }

  const handleScreenshotUpload = async (id: string, screenshotUrl: string) => {
    try {
      const updatedDetails = details.map(item =>
        item.id === id
          ? { ...item, paymentStatus: 'done', paidSalary: item.totalSalary, pendingSalary: 0, paymentScreenshot: screenshotUrl }
          : item
      )

      setDetails(updatedDetails as BatchDetail[])

      await updateBatchDetail(id, { paymentStatus: 'done', paymentScreenshot: screenshotUrl })
      router.refresh()
    } catch (error) {
      console.error('Failed to upload screenshot:', error)
      setDetails(initialDetails)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course Name</TableHead>
          <TableHead>Lecture Name</TableHead>
          <TableHead>Work Status</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Total Salary</TableHead>
          <TableHead>Paid Salary</TableHead>
          <TableHead>Pending Salary</TableHead>
          <TableHead>Payment Screenshot</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {details.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.courseName}</TableCell>
            <TableCell>{item.lectureName}</TableCell>
            <TableCell>
              <Select
                onValueChange={(value) => handleStatusChange(item.id, 'workStatus', value)}
                defaultValue={item.workStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Work Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Select
                onValueChange={(value) => handleStatusChange(item.id, 'paymentStatus', value)}
                defaultValue={item.paymentStatus}
                disabled={item.paymentStatus === 'done'}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>${item.totalSalary}</TableCell>
            <TableCell>${item.paidSalary}</TableCell>
            <TableCell>${item.pendingSalary}</TableCell>
            <TableCell>
              {item.paymentScreenshot ? (
                <Image
                  src={item.paymentScreenshot || "/placeholder.svg"}
                  alt="Payment Screenshot"
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              ) : (
                <ScreenshotUploader
                  batchDetailId={item.id}
                  onUploadComplete={(url) => handleScreenshotUpload(item.id, url)}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

