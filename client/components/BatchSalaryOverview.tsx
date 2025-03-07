"use client"
import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBatchSalaryData } from "@/lib/api";


interface BatchSalaryData {
  id: string;
  courseName: string;
  batchName: string;
  year: number;
  month: number;
  lecturerName: string;
  lecturerCourseName: string;
  salary: number;
  paidAmount: number;
  paymentStatus: "Pending" | "Paid";
}


export default function BatchSalaryOverview() {
  const [batchSalaryData, setBatchSalaryData] = useState<BatchSalaryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof BatchSalaryData>("courseName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "Pending" | "Paid">("all");
  const [monthFilter, setMonthFilter] = useState<number | "all">("all");
  const [batchFilter, setBatchFilter] = useState<string | "all">("all");
  const [courseFilter, setCourseFilter] = useState<string | "all">("all");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBatchSalaryData(); // Call the API to fetch data
      console.log("Fetched batch salary data:", data); // Log the data
      setBatchSalaryData(data);
    } catch (err) {
      console.error("Error fetching batch salary data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedAndFilteredData = useMemo(() => {
    return batchSalaryData
      .filter((item) =>
        Object.values(item).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
      .filter((item) => yearFilter === "all" || item.year === yearFilter)
      .filter((item) => statusFilter === "all" || item.paymentStatus === statusFilter)
      .filter((item) => monthFilter === "all" || item.month === monthFilter)
      .filter((item) => batchFilter === "all" || item.batchName === batchFilter)
      .filter((item) => courseFilter === "all" || item.courseName === courseFilter)
      .sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
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
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Batch and Salary Overview</h2>
        <Button onClick={fetchData} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Add filters here */}
          <div>
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
                {/* Populate unique years dynamically */}
              </SelectContent>
            </Select>
          </div>
          {/* Add other filters similarly */}
        </div>
        <div className="rounded-md border mt-4">
          <Table>
            
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Batch Name</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Lecturer Name</TableHead>
                <TableHead>Lecturer Course</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedAndFilteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.courseName}</TableCell>
                  <TableCell>{item.batchName}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{new Date(2000, item.month - 1).toLocaleString("default", { month: "long" })}</TableCell>
                  <TableCell>{item.lectureName}</TableCell> {/* Ensure this is correctly referenced */}
                  <TableCell>{item.lectureCourse}</TableCell> {/* Ensure this is correctly referenced */}
                  <TableCell>{item.salary}</TableCell>
                  <TableCell>{item.paidAmount}</TableCell>
                  <TableCell>{item.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            
          </Table>
        </div>
      </div>
    </div>
  );
}