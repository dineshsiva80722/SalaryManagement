"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getBatchSalaryData } from "@/lib/api"; // Keep this import
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { deleteBatch } from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteExtraCourse, getExtraCourseDetails, getAllBatches } from "@/lib/api"; // Adjust the path as necessary

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getMonthName } from "@/lib/utils"
import { updateBatchCourse } from "@/lib/api"; // Adjust the path as necessary
import {
  getCourses,
  getAvailableBatches,
  addBatchCourse,
} from "@/lib/api" // Removed getExtraCourseDetails


function formatINR(amount: number | undefined): string {
  if (amount === undefined || isNaN(amount)) {
    return "₹0.00";
  }
  return amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
}

interface Course {
  id: string
  name: string
}

interface Batch {
  id: string
  name: string
  year: number
  month: number
  _id: string
}



interface BatchCourse {
  id: string;
  name: string;
  lectureName: string;
  paymentStatus: string;
  salary: number;
  paidAmount: number;
}


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

export default function BatchDetailsManagement() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState<Omit<BatchCourse, "id">>({
    name: "",
    lectureName: "",
    paymentStatus: "Pending",
    salary: 0,
    paidAmount: 0,
  });

  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [addCourseData, setAddCourseData] = useState({
    name: "",
    lectureName: "",
    paymentStatus: "Pending",
    salary: 0,
    paidAmount: 0
  });

  const [formData, setFormData] = useState({
    course: "",
    month: 0,
    batch: "",
    courseName: "",
    lecturerName: "",
    salary: 0,
    paidAmount: 0,
  });

  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const [batchCourseDetails, setBatchCourseDetails] = useState<{
    id: string;
    courseName: string;
    lecturerName: string;
    salary: number;
    paidAmount: number;
    status: "Pending" | "Paid";
  }[]>([]);

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourses();
      console.log('Raw API response:', data);

      // Format courses to ensure they have IDs
      const formattedCourses = data.map((course: any) => ({
        id: course._id || course.id || course.customId,
        name: course.name,
        description: course.description || ''
      }));

      console.log('Formatted courses with IDs:', formattedCourses);
      setCourses(formattedCourses);

      // Reset form when courses change
      setFormData(prevData => ({
        ...prevData,
        course: '',
        month: 0,
        batch: ''
      }));
      setAvailableBatches([]);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);


  // useEffect(() => {
  //   const fetchBatches = async () => {
  //     if (!formData.course || !selectedYear || !formData.month) {
  //       setAvailableBatches([]);
  //       return;
  //     }
  //     try {
  //       setIsLoadingBatches(true);
  //       const batches = await getAvailableBatches(formData.course, selectedYear, formData.month);
  //       setAvailableBatches(batches);
  //       console.log('Fetched batches:', batches);
  //     } catch (error) {
  //       console.error('Error fetching batches:', error);
  //       setError('Failed to fetch batches. Please try again.');
  //     } finally {
  //       setIsLoadingBatches(false);
  //     }
  //   };
  
  //   fetchBatches();
  // }, [formData.course, formData.month, selectedYear]);

  
  useEffect(() => {
    const fetchBatches = async () => {
      if (!formData.course || !selectedYear || !formData.month) {
        setAvailableBatches([]);
        return;
      }
      try {
        setIsLoadingBatches(true);
        const batches = await getAvailableBatches(formData.course, selectedYear, formData.month);
        
        // Ensure batches is an array of Batch objects
        const formattedBatches = batches.map((batch: any) => ({
          id: batch.id || batch._id,
          name: batch.name,
          year: batch.year,
          month: batch.month,
          _id: batch._id
        }));
  
        setAvailableBatches(formattedBatches);
        console.log('Fetched batches:', formattedBatches);
      } catch (error) {
        console.error('Error fetching batches:', error);
        setError('Failed to fetch batches. Please try again.');
      } finally {
        setIsLoadingBatches(false);
      }
    };
  
    fetchBatches();
  }, [formData.course, formData.month, selectedYear]);

  const handleCourseChange = (courseId: string) => {
    if (!courseId) {
      setError('Please select a valid course');
      return;
    }
    setFormData(prev => ({
      ...prev,
      course: courseId,
      month: 0,
      batch: "",
    }));
  };

  const handleMonthChange = (month: number) => {
    setFormData(prevData => ({
      ...prevData,
      month,
      batch: ''
    }));
    setSelectedMonth(month);
    setAvailableBatches([]);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setFormData(prev => ({
      ...prev,
      month: 0,
      batch: ''
    }));
  };

  const handleBatchChange = (batchId: string) => {
    console.log('Batch ID received:', batchId); // Log the received batch ID

    // Validate batch ID
    if (!batchId) {
      setError('Please select a valid batch');
      return;
    }

    // Find the selected batch
    const selectedBatch = availableBatches.find(batch => batch._id === batchId); // Ensure you're using the correct property
    if (!selectedBatch) {
      setError('Selected batch not found');
      return;
    }

    // Update form state
    setFormData(prevData => ({
      ...prevData,
      batch: batchId,
    }));

    // Clear any previous error
    setError(null);

    // Log the selected batch details
    console.log('Selected batch:', selectedBatch); // Log the selected batch details
  };

  const handleDeleteBatch = async (courseId: string, batchId: string) => {
    console.log("Deleting batch:", { courseId, batchId }); // Debugging

    try {
      const response = await fetch(`/api/extracourse/${courseId}/${batchId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete batch");
      }

      console.log("Batch deleted successfully:", data);
      setAvailableBatches((prevBatches) => prevBatches.filter(batch => batch._id !== batchId));
      setSuccess('Batch deleted successfully!');
    } catch (error) {
      console.error("Error deleting batch:", error);
      setError("Failed to delete batch. Please try again.");
    }
  };

  // const handleUpdateBatchCourse = async (courseId: string, updates: Partial<BatchCourse>) => {
  //   try {
  //     await updateBatchCourse(courseId, updates);
  //     setBatchCourses((prevCourses) =>
  //       prevCourses.map(course =>
  //         course.id === courseId ? { ...course, ...updates } : course
  //       )
  //     );
  //     setSuccess('Course updated successfully!');
  //   } catch (error) {
  //     console.error("Error updating batch course:", error);
  //     setError("Failed to update batch course. Please try again.");
  //   }
  // };

  // const handleUpdateBatchCourse = async (courseId: string, updates: Partial<BatchCourse>, batchId: string, courseIndex: number) => {
  //   try {
  //     await updateBatchCourse(courseId, updates, batchId, courseIndex);
  //     setBatchCourseDetails((prevCourses) =>
  //       prevCourses.map(course =>
  //         course.id === courseId ? { ...course, ...updates } : course
  //       )
  //     );
  //     setSuccess('Course updated successfully!');
  //   } catch (error) {
  //     console.error("Error updating batch course:", error);
  //     setError("Failed to update batch course. Please try again.");
  //   }
  // };


  const handleAddBatchCourse = useCallback(async () => {
    if (!formData.batch) {
      setError('Please select a batch before adding a course');
      return;
    }
  
    try {
      setSubmitting(true);
      setError(null);
      const response = await addBatchCourse(formData.course, formData.batch, newCourse);
      if (!response) {
        throw new Error('Failed to add course to batch');
      }
      setSuccess('Course added successfully!');
      fetchBatchCourseDetails();
      setNewCourse({
        name: '',
        lectureName: '',
        paymentStatus: 'Pending',
        salary: 0,
        paidAmount: 0
      });
    } catch (error) {
      console.error('Error adding course:', error);
      setError(error instanceof Error ? error.message : 'Failed to add course');
    } finally {
      setSubmitting(false);
    }
  }, [formData.course, formData.batch, newCourse]);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Validate form data
      if (!formData.course || !formData.month || !formData.batch) {
        throw new Error('Please select a course, month, and batch');
      }

      if (!formData.courseName?.trim()) {
        throw new Error('Course name is required');
      }

      if (!formData.lecturerName?.trim()) {
        throw new Error('Lecturer name is required');
      }

      if (!formData.salary || formData.salary <= 0) {
        throw new Error('Please enter a valid salary amount');
      }

      // Prepare course data
      const newCourse = {
        name: formData.courseName.trim(),
        lectureName: formData.lecturerName.trim(),
        salary: formData.salary,
        paidAmount: formData.paidAmount,
        paymentStatus: formData.paymentStatus
      };

      console.log('Adding new course:', newCourse);
      const response = await addBatchCourse(formData.course, formData.batch, newCourse);
      console.log('Course added successfully:', response);

      // Reset form
      setFormData({
        course: '',
        month: 0,
        batch: '',
        courseName: '',
        lecturerName: '',
        salary: 0
      });

      setSuccess('Extra course added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add extra course';
      console.error('Error adding extra course:', errorMessage);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      label: getMonthName(i + 1)
    }));
  }, []);

  const fetchBatchCourseDetails = useCallback(() => {
    if (!formData.batch) {
      console.error('Batch ID is not set');
      return;
    }

    console.log('Batch selected:', formData.batch);
    setShowAddCourseForm(true);
  }, [formData.batch]);

  useEffect(() => {
    if (formData.batch) {
      fetchBatchCourseDetails();
    }
  }, [formData.batch, fetchBatchCourseDetails]);

  useEffect(() => {
    if (formData.batch) {
      fetchBatchCourseDetails();
    } else {
      setBatchCourseDetails([]);
    }
  }, [formData.batch, fetchBatchCourseDetails]);

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
  const [selectedBatchCourse, setSelectedBatchCourse] = useState<BatchCourse | null>(null);
  // const [extraCourseDetails, setExtraCourseDetails] = useState<ExtraCourse | null>(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBatchSalaryData();
      console.log("Fetched batch salary data:", data);
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
    <div className="space-y-6">
      <button
        className="btn bg-blue-500 text-white p-2 px-10 my-5 rounded-lg"
        onClick={() => setShowForm(prev => !prev)}
      >
        Form
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Extra Course</CardTitle>
              <CardDescription>Add an extra course to an existing batch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Course Selection */}
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => handleCourseChange(value)}
                  disabled={loading}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading courses...
                      </SelectItem>
                    ) : courses.length === 0 ? (
                      <SelectItem value="none" disabled>No courses available</SelectItem>
                    ) : (
                      courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              {/* Year Selection */}
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => handleYearChange(parseInt(value))}
                  disabled={!formData.course}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Month Selection */}
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Select
                  value={formData.month.toString()}
                  onValueChange={(value) => handleMonthChange(parseInt(value))}
                  disabled={!formData.course}
                >
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Select a month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Batch Selection */}
              <div className="space-y-2">
                <Label htmlFor="batch">Batch</Label>
                <Select
                  value={formData.batch}
                  onValueChange={(value) => {
                    if (!value) {
                      setError('Please select a valid batch');
                      return;
                    }
                    handleBatchChange(value);
                  }}
                  disabled={!formData.month || isLoadingBatches}
                >
                  <SelectTrigger id="batch">
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingBatches ? (
                      <SelectItem value="loading" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading batches...
                      </SelectItem>
                    ) : availableBatches.length === 0 ? (
                      <SelectItem value="none" disabled>No batches available</SelectItem>
                    ) : (
                      availableBatches.map((batch) => (
                        <SelectItem key={batch._id} value={batch._id}>
                          {batch.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              {/* Extra Course Details */}
              {formData.batch && showAddCourseForm && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Extra Course Details</h3>
                  <div className="space-y-2">
                    <Label htmlFor="course-name">Course Name</Label>
                    <Input
                      id="course-name"
                      value={formData.courseName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        courseName: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lecturer-name">Lecturer Name</Label>
                    <Input
                      id="lecturer-name"
                      value={formData.lecturerName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        lecturerName: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (₹)</Label>
                    <Input
                      id="salary"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.salary || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        salary: Number(e.target.value)
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paid">Paid Amount</Label>
                    <Input
                      id="paid"
                      type="number"
                      value={formData.paidAmount || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        paidAmount: Number(e.target.value)
                      }))}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-status">Payment Status</Label>
                    <Input
                      id="payment-status"
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        paymentStatus: e.target.value
                      }))}
                      required
                    />
                  </div>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <Button
              type="submit"
              className="w-full"
              disabled={!formData.course || !formData.batch || !formData.courseName || !formData.lecturerName || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding course...
                </>
              ) : (
                'Add Extra Course'
              )}
            </Button>
          </Card>
        </form>
      )}

      <section className="">
        <section>
          <h2 className="text-2xl font-bold">Extra Course Overview</h2>
          <Table className="text-center">
            <TableHeader>
              <TableRow>
                <TableHead>Lecturer Name</TableHead>
                <TableHead>Lecturer Course</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchSalaryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.lectureName}</TableCell> {/* Ensure this is correctly referenced */}
                  <TableCell>{item.lectureCourse}</TableCell> 
                  <TableCell>{item.salary}</TableCell>
                  <TableCell>{item.paidAmount}</TableCell>
                  <TableCell>{item.paymentStatus}</TableCell>
                  <TableCell>
                    <div className="p-5">
                      <button
                        className="bg-red-500 p-2 px-5 mx-2 rounded-lg"
                        onClick={async () => {
                          const confirmDelete = window.confirm(`\nLecturer Name: ${item.lectureName}\nLecturer Course: ${item.lectureCourse}\nSalary: ${item.salary}\nPaid Amount: ${item.paidAmount}\nPayment Status: ${item.paymentStatus}`);
                          if (confirmDelete) {
                            try {
                              await handleDeleteBatch(item.courseId, item.id); // Ensure item has courseId and id properties
                              alert('Batch deleted successfully!');
                              fetchData(); // Refresh the data to reflect the deletion
                            } catch (error) {
                              console.error("Failed to delete batch:", error);
                              alert("Failed to delete batch. Please try again.");
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                      <button className="bg-blue-500 p-2 px-5 mx-2 rounded-lg">Update</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </section>
    </div>
  );
}