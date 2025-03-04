"use client"

import { useState, useEffect, useCallback } from "react"
import { getCourses, getBatches, createBatch, updateBatch, deleteBatch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { log } from "console"

interface Course {
  id: string
  name: string
}

interface Batch {
  id: string
  name: string
  year: number
  month: number
  courseId: string
}

export default function BatchManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(0) // 0 means all months
  const [newBatch, setNewBatch] = useState({ name: "", year: new Date().getFullYear(), month: 1, courseId: "" })
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse && selectedYear) {
      fetchBatches(selectedCourse, selectedYear)
    }
  }, [selectedCourse, selectedYear])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const fetchedCourses = await getCourses()
      setCourses(fetchedCourses)
      if (fetchedCourses.length > 0) {
        setSelectedCourse(fetchedCourses[0].id)
      }
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError("Failed to fetch courses. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchBatches = async (courseId: string, year: number) => {
    try {
      setLoading(true)
      const fetchedBatches = await getBatches(courseId, year)
      setBatches(fetchedBatches)
    } catch (err) {
      console.error("Error fetching batches:", err)
      setError("Failed to fetch batches. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBatch = async () => {
    try {
      if (!newBatch.name || !newBatch.year || !newBatch.month) {
        throw new Error("Batch name, year, and month are required")
      }
      console.log(selectedCourse);
      await createBatch({ ...newBatch, courseId: selectedCourse })
      setNewBatch({ name: "", year: new Date().getFullYear(), month: 1, courseId: "" })
      fetchBatches(selectedCourse, selectedYear)
    } catch (err) {
      console.error("Error creating batch:", err)
      setError(err instanceof Error ? err.message : "Failed to create batch. Please try again.")
    }
  }

  // const handleUpdateBatch = async () => {
  //   if (editingBatch) {
  //     try {
  //       if (!editingBatch.name || !editingBatch.year || !editingBatch.month) {
  //         throw new Error("Batch name, year, and month are required");
  //       }
  //       console.log("Updating batch with data:", editingBatch);
        
  //       const response = await updateBatch(selectedCourse,editingBatch._id, editingBatch);
  //       console.log("Update response:", response);
  
  //       setEditingBatch(null);
  //       fetchBatches(selectedCourse, selectedYear);
  //     } catch (err) {
  //       console.error("Error updating batch:", err);
  //       console.log(updateBatch(selectedCourse,editingBatch.id, editingBatch));
        
  //       setError(err instanceof Error ? err.message : "Failed to update batch. Please try again.");
  //     }
  //   }
  // };
  

  const handleUpdateBatch = async () => {
    if (!editingBatch) return;
  
    try {
      // ✅ Ensure required fields are present
      if (!editingBatch.name || !editingBatch.year || !editingBatch.month) {
        throw new Error("Batch name, year, and month are required");
      }
  
      console.log("🔄 Updating batch with data:", editingBatch);
  
      // ✅ Call API to update batch
      const updatedBatch = await updateBatch(selectedCourse, editingBatch._id, {
        name: editingBatch.name,
        year: editingBatch.year,
        month: editingBatch.month,
      });
  
      console.log("✅ Batch updated successfully:", updatedBatch);
  
      // ✅ Reset editing state & refresh batches
      setEditingBatch(null);
      await fetchBatches(selectedCourse, selectedYear);
    } catch (err) {
      console.error("❌ Error updating batch:", err);
      setError(err instanceof Error ? err.message : "Failed to update batch. Please try again.");
    }
  };
  

  
  

  const handleDeleteBatch = async (courseId: string, batchId: string) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      try {
        await deleteBatch(courseId, batchId)
        fetchBatches(selectedCourse, selectedYear)
      } catch (err) {
        console.error("Error deleting batch:", err)
        setError("Failed to delete batch. Please try again.")
      }
    }
  }

  const filteredBatches = selectedMonth === 0 ? batches : batches.filter((batch) => batch.month === selectedMonth)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Batch Management</h2>
      {/* <div className="mb-4">
        <Label htmlFor="course-select">Select Course</Label>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger id="course-select">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      {/* <div className="mb-4 relative">
  <Label htmlFor="course-select">Select Course</Label>
  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
    <SelectTrigger id="course-select" className="w-full">
      <SelectValue placeholder="Select a course" />
    </SelectTrigger>
    <SelectContent className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-50">
      {courses.map((course) => (
        <SelectItem key={course.id} value={course.id}>
          {course.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div> */}
      {/* <div className="mb-4">
        <Label htmlFor="course-select">Select Course</Label>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger id="course-select">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <div className="mb-4">
  <Label htmlFor="course-select">Select Course</Label>
  <Select
    value={selectedCourse || ""}
    onValueChange={(value) => {
      console.log("Selected Course:", value) // Debugging log
      setSelectedCourse(value)
    }}
  >
    <SelectTrigger id="course-select">
      <SelectValue>{courses.find((c) => c._id === selectedCourse)?.name || "Select a course"}</SelectValue>
    </SelectTrigger>
    <SelectContent>
      {courses.map((course) => (
        <SelectItem key={course._id} value={course._id}>
          {course.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


      <div className="mb-4">
        <Label htmlFor="year-select">Select Year</Label>
        <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
          <SelectTrigger id="year-select">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(10)].map((_, i) => {
              const year = new Date().getFullYear() - 5 + i
              return (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <Label htmlFor="month-select">Select Month</Label>
        <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}>
          <SelectTrigger id="month-select">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Months</SelectItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <SelectItem key={month} value={month.toString()}>
                {new Date(2000, month - 1).toLocaleString("default", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Batch</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Batch</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batch-name" className="text-right">
                Name
              </Label>
              <Input
                id="batch-name"
                value={newBatch.name}
                onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batch-year" className="text-right">
                Year
              </Label>
              <Select
                value={newBatch.year.toString()}
                onValueChange={(value) => setNewBatch({ ...newBatch, year: Number.parseInt(value) })}
              >
                <SelectTrigger id="batch-year" className="col-span-3">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => {
                    const year = new Date().getFullYear() - 5 + i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batch-month" className="text-right">
                Month
              </Label>
              <Select
                value={newBatch.month.toString()}
                onValueChange={(value) => setNewBatch({ ...newBatch, month: Number.parseInt(value) })}
              >
                <SelectTrigger id="batch-month" className="col-span-3">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateBatch}>Save Batch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredBatches.map((batch) => (
          <Card key={batch.id}>
            <CardHeader>
              <CardTitle>{batch.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Year: {batch.year}</p>
              <p>Month: {new Date(0, batch.month - 1).toLocaleString("default", { month: "long" })}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingBatch(batch)}>Edit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Batch</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-batch-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="edit-batch-name"
                        value={editingBatch?.name || ""}
                        onChange={(e) => setEditingBatch({ ...editingBatch!, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-batch-year" className="text-right">
                        Year
                      </Label>
                      <Select
                        value={editingBatch?.year.toString()}
                        onValueChange={(value) => setEditingBatch({ ...editingBatch!, year: Number.parseInt(value) })}
                      >
                        <SelectTrigger id="edit-batch-year" className="col-span-3">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => {
                            const year = new Date().getFullYear() - 5 + i
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-batch-month" className="text-right">
                        Month
                      </Label>
                      <Select
                        value={editingBatch?.month.toString()}
                        onValueChange={(value) => setEditingBatch({ ...editingBatch!, month: Number.parseInt(value) })}
                      >
                        <SelectTrigger id="edit-batch-month" className="col-span-3">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {new Date(0, i).toLocaleString("default", { month: "long" })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleUpdateBatch}>Update Batch</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="destructive" onClick={() => {
            console.log(selectedCourse, batch._id);
            handleDeleteBatch(selectedCourse, batch._id);
          }}>Delete
            </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

