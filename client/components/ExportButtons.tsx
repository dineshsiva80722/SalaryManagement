"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useRef } from "react"
import { toPng } from "html-to-image"
import jsPDF from "jspdf"
import * as XLSX from "xlsx"

function formatINR(amount: number): string {
  return amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  })
}

interface BatchDetail {
  id: string
  courseName: string
  lectureName: string
  workStatus: string
  paymentStatus: string
  totalSalary: number
  paidSalary: number
  paymentScreenshot?: string
}

interface ExportButtonsProps {
  data: BatchDetail[]
  fileName: string
}

export function ExportButtons({ data, fileName }: ExportButtonsProps) {
  const tableRef = useRef<HTMLTableElement>(null)

  const exportToPDF = async () => {
    if (tableRef.current) {
      const canvas = await toPng(tableRef.current, { quality: 0.95 })
      const pdf = new jsPDF()

      // Add title
      pdf.setFontSize(18)
      pdf.text(fileName, 14, 15)

      // Add table
      pdf.addImage(canvas, "PNG", 14, 25, 180, 0)

      // Add statements at the bottom
      pdf.setFontSize(12)
      const totalPaid = data.reduce((sum, item) => sum + item.paidSalary, 0)
      const totalPending = data.reduce((sum, item) => sum + (item.totalSalary - item.paidSalary), 0)
      pdf.text(`Total Paid: ${formatINR(totalPaid)}`, 14, pdf.internal.pageSize.height - 20)
      pdf.text(`Total Pending: ${formatINR(totalPending)}`, 14, pdf.internal.pageSize.height - 10)
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        "Course Name": item.courseName,
        "Lecture Name": item.lectureName,
        "Work Status": item.workStatus,
        "Payment Status": item.paymentStatus,
        "Total Salary": formatINR(item.totalSalary),
        "Paid Salary": formatINR(item.paidSalary),
        "Pending Salary": formatINR(item.totalSalary - item.paidSalary),
      })),
    )

    const totalPaid = data.reduce((sum, item) => sum + item.paidSalary, 0)
    const totalPending = data.reduce((sum, item) => sum + (item.totalSalary - item.paidSalary), 0)

    // Add total statements at the bottom of the sheet
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[`Total Paid: ${formatINR(totalPaid)}`], [`Total Pending: ${formatINR(totalPending)}`]],
      { origin: -1 },
    ) // -1 means add to the bottom

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Batch Details")
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button onClick={exportToPDF} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
        <Button onClick={exportToExcel} variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Excel
        </Button>
      </div>
      <div className="sr-only">
        <table ref={tableRef} className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Course Name</th>
              <th className="px-4 py-2 border-b">Lecture Name</th>
              <th className="px-4 py-2 border-b">Work Status</th>
              <th className="px-4 py-2 border-b">Payment Status</th>
              <th className="px-4 py-2 border-b">Total Salary</th>
              <th className="px-4 py-2 border-b">Paid Salary</th>
              <th className="px-4 py-2 border-b">Pending Salary</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{item.courseName}</td>
                <td className="px-4 py-2 border-b">{item.lectureName}</td>
                <td className="px-4 py-2 border-b">{item.workStatus}</td>
                <td className="px-4 py-2 border-b">{item.paymentStatus}</td>
                <td className="px-4 py-2 border-b">${item.totalSalary}</td>
                <td className="px-4 py-2 border-b">${item.paidSalary}</td>
                <td className="px-4 py-2 border-b">${item.totalSalary - item.paidSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

