"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, RefreshCw, FileDown, Printer } from "lucide-react"
import { getBatchSalaryData } from "@/lib/api"
import { usePDF } from "react-to-pdf"

function formatINR(amount: number): string {
  return amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  })
}

const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    .print-only {
      display: block !important;
    }
    @page {
      size: A4;
      margin: 20mm;
    }
  }
`

interface BatchSalaryData {
  id: string
  courseName: string
  batchName: string
  year: number
  month: number
  lecturerName: string
  lecturerCourseName: string
  salary: number
  paidAmount: number
  status: "Pending" | "Paid"
}

export default function BatchSalaryOverview() {
  const [batchSalaryData, setBatchSalaryData] = useState<BatchSalaryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<keyof BatchSalaryData>("courseName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [yearFilter, setYearFilter] = useState<number | "all">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "Pending" | "Paid">("all")
  const [monthFilter, setMonthFilter] = useState<number | "all">("all")
  const [batchFilter, setBatchFilter] = useState<string | "all">("all")
  const [courseFilter, setCourseFilter] = useState<string | "all">("all")
  const [showStatement, setShowStatement] = useState(false)

  const { toPDF, targetRef } = usePDF({ filename: "salary-statement.pdf" })

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getBatchSalaryData()
      setBatchSalaryData(data)
    } catch (err) {
      console.error("Error fetching batch salary data:", err)
      setError("Failed to fetch data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRefresh = () => {
    fetchData()
  }

  const sortedAndFilteredData = useMemo(() => {
    return batchSalaryData
      .filter((item) =>
        Object.values(item).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
      .filter((item) => yearFilter === "all" || item.year === yearFilter)
      .filter((item) => statusFilter === "all" || item.status === statusFilter)
      .filter((item) => monthFilter === "all" || item.month === monthFilter)
      .filter((item) => batchFilter === "all" || item.batchName === batchFilter)
      .filter((item) => courseFilter === "all" || item.courseName === courseFilter)
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
        return 0
      })
  }, [
    batchSalaryData,
    searchTerm,
    sortColumn,
    sortDirection,
    yearFilter,
    statusFilter,
    monthFilter,
    batchFilter,
    courseFilter,
  ])

  const totals = useMemo(() => {
    return sortedAndFilteredData.reduce(
      (acc, item) => {
        acc.totalSalary += item.salary
        acc.totalPaid += item.paidAmount
        acc.totalPending += item.salary - item.paidAmount
        return acc
      },
      { totalSalary: 0, totalPaid: 0, totalPending: 0 },
    )
  }, [sortedAndFilteredData])

  const handleSort = (column: keyof BatchSalaryData) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const uniqueYears = Array.from(new Set(batchSalaryData.map((item) => item.year)))

  const handleShowStatement = () => {
    setShowStatement(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const groupedBatches = useMemo(() => {
    const groups: { [key: string]: BatchSalaryData[] } = {}
    sortedAndFilteredData.forEach((item) => {
      const batchGroup = item.batchName.split(" ")[0] // Assuming batch names are like "B1 Batch1", "B2 Batch1", etc.
      if (!groups[batchGroup]) {
        groups[batchGroup] = []
      }
      groups[batchGroup].push(item)
    })
    return groups
  }, [sortedAndFilteredData])

  useEffect(() => {
    const style = document.createElement("style")
    style.innerHTML = printStyles
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-4">
      {showStatement ? (
        <div ref={targetRef} className="bg-white p-8 max-w-full mx-auto my-8 shadow-lg print-only">
          <h2 className="text-2xl font-bold mb-4 text-center">Salary Statement</h2>
          <div className="mb-4">
            <p>
              <strong>Course Name:</strong> {courseFilter === "all" ? "All Courses" : courseFilter}
            </p>
            <p>
              <strong>Year:</strong> {yearFilter === "all" ? "All Years" : yearFilter}
            </p>
            <p>
              <strong>Month:</strong>{" "}
              {monthFilter === "all"
                ? "All Months"
                : new Date(2000, Number(monthFilter) - 1).toLocaleString("default", { month: "long" })}
            </p>
            <p>
              <strong>Batch Name:</strong> {batchFilter === "all" ? "All Batches" : batchFilter}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(groupedBatches).map(([batchGroup, batchData]) => (
              <Card key={batchGroup}>
                <CardHeader>
                  <CardTitle>{batchGroup} Batches</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Lecturer Name</TableHead>
                        <TableHead>Lecturer Course</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batchData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.courseName}</TableCell>
                          <TableCell>{item.batchName}</TableCell>
                          <TableCell>{item.lecturerName}</TableCell>
                          <TableCell>{item.lecturerCourseName}</TableCell>
                          <TableCell>{formatINR(item.salary)}</TableCell>
                          <TableCell>{formatINR(item.paidAmount)}</TableCell>
                          <TableCell>{item.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <p>
              <strong>Total Salary:</strong> {formatINR(totals.totalSalary)}
            </p>
            <p>
              <strong>Total Paid:</strong> {formatINR(totals.totalPaid)}
            </p>
            <p>
              <strong>Total Pending:</strong> {formatINR(totals.totalPending)}
            </p>
          </div>
          <div className="mt-8 text-right">
            <p>Verified by:</p>
            <div className="border-b border-black w-40 h-20 inline-block"></div>
          </div>
          <div className="mt-4 flex justify-between no-print">
            <Button onClick={() => setShowStatement(false)} variant="outline">
              Back to Overview
            </Button>
            <div className="space-x-2">
              <Button onClick={() => toPDF()} variant="outline">
                <FileDown className="mr-2 h-4 w-4" /> Export PDF
              </Button>
              <Button onClick={handlePrint} variant="outline">
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Batch and Salary Overview</h2>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatINR(totals.totalSalary)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatINR(totals.totalPaid)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatINR(totals.totalPending)}</div>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="year-filter">Filter by Year</Label>
                <Select
                  value={yearFilter.toString()}
                  onValueChange={(value) => setYearFilter(value === "all" ? "all" : Number.parseInt(value))}
                >
                  <SelectTrigger id="year-filter">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as "all" | "Pending" | "Paid")}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="month-filter">Filter by Month</Label>
                <Select
                  value={monthFilter.toString()}
                  onValueChange={(value) => setMonthFilter(value === "all" ? "all" : Number.parseInt(value))}
                >
                  <SelectTrigger id="month-filter">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {new Date(2000, month - 1).toLocaleString("default", { month: "long" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="batch-filter">Filter by Batch</Label>
                <Select value={batchFilter} onValueChange={setBatchFilter}>
                  <SelectTrigger id="batch-filter">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {Array.from(new Set(batchSalaryData.map((item) => item.batchName))).map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="course-filter">Filter by Course</Label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger id="course-filter">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {Array.from(new Set(batchSalaryData.map((item) => item.courseName))).map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">
                      <Button variant="ghost" onClick={() => handleSort("courseName")}>
                        Course Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("batchName")}>
                        Batch Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("year")}>
                        Year
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("month")}>
                        Month
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("lecturerName")}>
                        Lecturer Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("lecturerCourseName")}>
                        Lecturer Course
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" onClick={() => handleSort("salary")}>
                        Salary
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" onClick={() => handleSort("paidAmount")}>
                        Paid Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort("status")}>
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.courseName}</TableCell>
                      <TableCell>{item.batchName}</TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>
                        {new Date(2000, item.month - 1).toLocaleString("default", { month: "long" })}
                      </TableCell>
                      <TableCell>{item.lecturerName}</TableCell>
                      <TableCell>{item.lecturerCourseName}</TableCell>
                      <TableCell className="text-right">{formatINR(item.salary)}</TableCell>
                      <TableCell className="text-right">{formatINR(item.paidAmount)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button onClick={handleShowStatement} variant="outline" size="sm" className="mt-4">
              Generate Statement
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

