'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateScheduleItem } from '@/lib/api'
import { useRouter } from 'next/navigation'

export interface ScheduleItem {
  id: string;
  batch: string;
  courseTitle: string;
  lectureName: string;
  worksheetStatus: string;
  paymentStatus: string;
}




interface MonthlyScheduleTableProps {
    schedule: ScheduleItem[];
    courseId: string;
    onSelectMonth: (month: number) => void;
    selectedMonth: number | null; // Add this line
}

// interface ScheduleItem {
//   id: string;
//   batch: string;
//   courseTitle: string;
//   lectureName: string;
//   worksheetStatus: string;
//   paymentStatus: string;
// }


interface MonthlyScheduleTableProps {
    schedule: ScheduleItem[];
    courseId: string; // Existing line
    onSelectMonth: (month: number) => void; // Add this line
}

export default function MonthlyScheduleTable({ schedule = [] }: MonthlyScheduleTableProps) { // Ensure schedule is not undefined
  const router = useRouter()

  interface MonthlyScheduleTableProps {
      schedule: ScheduleItem[]; // This is required
      courseId: string;
      onSelectMonth: (month: number) => void;
      selectedMonth: number | null;
  }

  const handleStatusChange = async (id: string, field: string, value: string): Promise<void> => {
    try {
      await updateScheduleItem(id, { [field]: value })
      router.refresh()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Batch</TableHead>
          <TableHead>Course Title</TableHead>
          <TableHead>Course Lecture Name</TableHead>
          <TableHead>Worksheet Status</TableHead>
          <TableHead>Payment Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedule?.map((item: ScheduleItem) => (
          <TableRow key={item.id}>
            <TableCell>{item.batch}</TableCell>
            <TableCell>{item.courseTitle}</TableCell>
            <TableCell>{item.lectureName}</TableCell>
            <TableCell>
              <Select
          onValueChange={(value: string) => handleStatusChange(item.id, 'worksheetStatus', value)}
          defaultValue={item.worksheetStatus}
              >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
          </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Select
          onValueChange={(value: string) => handleStatusChange(item.id, 'paymentStatus', value)}
          defaultValue={item.paymentStatus}
              >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
