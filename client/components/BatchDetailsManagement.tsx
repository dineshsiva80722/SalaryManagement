// "use client"

// import { useState, useEffect, useMemo, useCallback } from "react"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Loader2 } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { getMonthName } from "@/lib/utils"
// import {
//   getCourses,
//   getAvailableBatches,
//   addBatchCourse,
//   getBatchDetails,
//   API_BASE_URL
// } from "@/lib/api"

// function formatINR(amount: number | undefined): string {
//   if (amount === undefined || isNaN(amount)) {
//     return "₹0.00";
//   }
//   return amount.toLocaleString("en-IN", {
//     maximumFractionDigits: 2,
//     style: "currency",
//     currency: "INR",
//   });
// }

// interface Course {
//   id: string
//   name: string
// }

// interface Batch {
//   id: string
//   name: string
//   year: number
//   month: number
// }

// type WorkStatus = "Not Started" | "In Progress" | "Incomplete" | "Complete";
// type PaymentStatus = "Pending" | "Done";

// interface BatchCourse {
//   id: string
//   name: string
//   lectureName: string
//   workStatus: WorkStatus
//   paymentStatus: PaymentStatus
//   salary: number
//   paidAmount: number
// }

// export default function BatchDetailsManagement() {
//   const [selectedCourse, setSelectedCourse] = useState<string>("");
//   const [selectedMonth, setSelectedMonth] = useState<number>(0);
//   const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
//   const [selectedBatch, setSelectedBatch] = useState<string>("");
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [newCourse, setNewCourse] = useState<Omit<BatchCourse, "id">>({
//     name: "",
//     lectureName: "",
//     workStatus: "Not Started",
//     paymentStatus: "Pending",
//     salary: 0,
//     paidAmount: 0,
//   })

//   const [showAddCourseForm, setShowAddCourseForm] = useState(false);
//   const [addCourseData, setAddCourseData] = useState({
//     name: "",
//     lectureName: "",
//     workStatus: "Not Started" as WorkStatus,
//     paymentStatus: "Pending" as PaymentStatus,
//     salary: 0,
//   });

//   const [formData, setFormData] = useState({
//     course: "",
//     month: 0,
//     batch: "",
//     courseName: "",
//     lecturerName: "",
//     salary: 0,
//   });

//   const [isLoadingBatches, setIsLoadingBatches] = useState(false);
//   const [isSubmitting, setSubmitting] = useState(false);

//   const [batchCourseDetails, setBatchCourseDetails] = useState<{
//     id: string;
//     courseName: string;
//     lecturerName: string;
//     salary: number;
//     paidAmount: number;
//     status: "Pending" | "Paid";
//   }[]>([]);

//   const [isLoadingDetails, setIsLoadingDetails] = useState(false);

//   // Fetch courses
//   const fetchCourses = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getCourses();
//       console.log('Raw API response:', data);

//       // Format courses to ensure they have IDs
//       const formattedCourses = data.map((course: any) => ({
//         id: course._id || course.id || course.customId,
//         name: course.name,
//         description: course.description || ''
//       }));

//       console.log('Formatted courses with IDs:', formattedCourses);
//       setCourses(formattedCourses);

//       // Reset form when courses change
//       setFormData(prevData => ({
//         ...prevData,
//         course: '',
//         month: 0,
//         batch: ''
//       }));
//       setAvailableBatches([]);
//     } catch (err) {
//       console.error('Error fetching courses:', err);
//       setError('Failed to fetch courses. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCourses();
//   }, [fetchCourses]);

//   useEffect(() => {
//     const fetchBatches = async () => {
//       if (!formData.course || !selectedYear || !formData.month) {
//         setAvailableBatches([]);
//         return;
//       }
//       try {
//         setIsLoadingBatches(true);
//         const batches = await getAvailableBatches(formData.course, selectedYear, formData.month);
//         setAvailableBatches(batches);
//         console.log('Fetched batches:', batches);
//       } catch (error) {
//         console.error('Error fetching batches:', error);
//         setError('Failed to fetch batches. Please try again.');
//       } finally {
//         setIsLoadingBatches(false);
//       }
//     };

//     fetchBatches();
//   }, [formData.course, formData.month, selectedYear]);

//   const handleCourseChange = (courseId: string) => {
//     alert(`Selected Course: ${courseId}`);
//     if (!courseId) {
//       setError('Please select a valid course');
//       return;
//     }
//     setFormData(prev => ({
//       ...prev,
//       course: courseId,
//       month: 0,
//       batch: "",
//     }));
//   };

//   const handleMonthChange = (month: number) => {
//     alert(`Selected Month: ${month}`);
//     setFormData(prevData => ({
//       ...prevData,
//       month,
//       batch: ''
//     }));
//     setSelectedMonth(month);
//     setAvailableBatches([]);
//   };

//   const handleYearChange = (year: number) => {
//     alert(`Selected Year: ${year}`);
//     setSelectedYear(year);
//     setFormData(prev => ({
//       ...prev,
//       month: 0,
//       batch: ''
//     }));
//   };

//   const handleBatchChange = (batchId: string) => {
//     console.log('Batch ID received:', batchId);

//     // Validate batch ID
//     if (!batchId) {
//       setError('Please select a valid batch');
//       return;
//     }

//     // Find the selected batch
//     const selectedBatch = availableBatches.find(batch => batch.id === batchId);
//     if (!selectedBatch) {
//       setError('Selected batch not found');
//       return;
//     }

//     // Update form state
//     setFormData(prevData => ({
//       ...prevData,
//       batch: batchId,
//     }));

//     // Clear any previous error
//     setError(null);

//     // Log the selected batch details
//     console.log('Selected batch:', selectedBatch);
//   };

//   const [batchCourses, setBatchCourses] = useState<BatchCourse[]>([]); // Add this state declaration

//   const handleUpdateBatchCourse = useCallback(
//     async (courseIndex: number, updates: Partial<BatchCourse>) => {
//       if (updates.workStatus && !["Not Started", "In Progress", "Incomplete", "Complete"].includes(updates.workStatus as WorkStatus)) {
//         setError("Invalid work status value");
//         return;
//       }

//       try {
//         // Ensure updateBatchCourse is imported or defined
//         if (!selectedCourse || !selectedBatch) {
//           setError('Please select a course and batch before updating a course');
//           return;
//         }
//         await updateBatchCourse(selectedCourse, selectedBatch, courseIndex, updates);
//         // Update local state
//         setBatchCourses((prevCourses) => {
//           const updatedCourses = [...prevCourses];
//           updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], ...updates };
//           return updatedCourses;
//         });
//       } catch (err) {
//         console.error("Error updating batch course:", err);
//         setError("Failed to update batch course. Please try again.");
//       }
//     },
//     [selectedCourse, selectedBatch]
//   );

//   const handleDeleteBatchCourse = useCallback(
//     async (courseId: string) => {
//       try {
//         await deleteBatchCourse(selectedCourse, selectedBatch, courseId)
//         setBatchCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId))
//       } catch (err) {
//         console.error("Error deleting batch course:", err)
//         setError("Failed to delete batch course. Please try again.")
//       }
//     },
//     [selectedCourse, selectedBatch],
//   )

//   const handleAddBatchCourse = useCallback(async () => {
//     if (!formData.batch) {
//       setError('Please select a batch before adding a course');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       setError(null);
//       const response = await addBatchCourse(formData.course, formData.batch, newCourse);
//       if (!response.ok) {
//         throw new Error('Failed to add course to batch');
//       }
//       setSuccess('Course added successfully!');
//       fetchBatchCourseDetails();
//       setNewCourse({
//         name: '',
//         lectureName: '',
//         workStatus: 'Not Started',
//         paymentStatus: 'Pending',
//         salary: 0,
//         paidAmount: 0
//       });
//     } catch (error) {
//       console.error('Error adding course:', error);
//       setError(error instanceof Error ? error.message : 'Failed to add course');
//     } finally {
//       setSubmitting(false);
//     }
//   }, [formData.course, formData.batch, newCourse]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       setSubmitting(true);
//       setError(null);

//       // Validate form data
//       if (!formData.course || !formData.month || !formData.batch) {
//         throw new Error('Please select a course, month, and batch');
//       }

//       if (!formData.courseName?.trim()) {
//         throw new Error('Course name is required');
//       }

//       if (!formData.lecturerName?.trim()) {
//         throw new Error('Lecturer name is required');
//       }

//       if (!formData.salary || formData.salary <= 0) {
//         throw new Error('Please enter a valid salary amount');
//       }

//       // Log the course details being added
//       console.log('Adding Extra Course Details:', {
//         Course: formData.courseName,
//         Lecturer: formData.lecturerName,
//         Salary: formData.salary,
//         Batch: formData.batch,
//         Month: getMonthName(formData.month)
//       });

//       // Prepare course data
//       const newCourse = {
//         name: formData.courseName.trim(),
//         lectureName: formData.lecturerName.trim(),
//         workStatus: 'Not Started' as const,
//         salary: formData.salary,
//         paidAmount: 0,
//         paymentStatus: 'Pending' as const
//       };

//       console.log('Adding new course:', newCourse);
//       const response = await addBatchCourse(formData.course, formData.batch, newCourse);
//       console.log('Course added successfully:', response);

//       // Reset form
//       setFormData({
//         course: '',
//         month: 0,
//         batch: '',
//         courseName: '',
//         lecturerName: '',
//         salary: 0
//       });

//       setSuccess('Extra course added successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to add extra course';
//       console.error('Error adding extra course:', errorMessage);
//       setError(errorMessage);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const monthOptions = useMemo(() => {
//     // Always show all 12 months
//     return Array.from({ length: 12 }, (_, i) => ({
//       value: (i + 1).toString(),
//       label: getMonthName(i + 1)
//     }));
//   }, []);

//   // Add function to fetch batch course details
//   const fetchBatchCourseDetails = useCallback(async () => {
//     if (!formData.batch) return;

//     try {
//       setError(null);
//       setIsLoadingDetails(true);
//       console.log('Fetching details for batch:', formData.batch);
//       const details = await getBatchDetails(formData.course, formData.batch);
//       console.log('Received batch details:', details);

//       if (!details || !details.courses) {
//         throw new Error('Invalid response format from server');
//       }

//       setBatchCourseDetails(details.courses.map(course => ({
//         id: course.id,
//         courseName: course.name,
//         lecturerName: course.lectureName,
//         salary: course.salary || 0,
//         paidAmount: course.paidAmount || 0,
//         status: course.paymentStatus
//       })));
//     } catch (error) {
//       console.error('Error fetching batch details:', error);
//       setError(error instanceof Error ? error.message : 'Failed to fetch batch details');
//       setBatchCourseDetails([]);
//     } finally {
//       setIsLoadingDetails(false);
//     }
//   }, [formData.batch, formData.course]);

//   // Fetch details when batch changes
//   useEffect(() => {
//     if (formData.batch) {
//       fetchBatchCourseDetails();
//     } else {
//       setBatchCourseDetails([]);
//     }
//   }, [formData.batch, fetchBatchCourseDetails]);

//   const handleUpdatePayment = async (index: number, paidAmount: number, status: "Pending" | "Paid") => {
//     try {
//       setError(null);
//       setIsLoadingDetails(true);
//       const detail = batchCourseDetails[index];

//       if (!detail || !detail.id) {
//         throw new Error('Invalid course details');
//       }

//       console.log('Updating payment:', { courseId: detail.id, paidAmount, status });
//       await updateBatchPayment(detail.id, {
//         paidAmount,
//         paymentStatus: status
//       });

//       // Update local state
//       const newDetails = [...batchCourseDetails];
//       newDetails[index] = {
//         ...newDetails[index],
//         paidAmount,
//         status
//       };
//       setBatchCourseDetails(newDetails);
//       setSuccess('Payment status updated successfully');
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
//       setError(errorMessage);
//       console.error('Error updating payment:', err);
//     } finally {
//       setIsLoadingDetails(false);
//     }
//   };

//   // Add refresh function
//   const handleRefresh = useCallback(() => {
//     if (formData.batch) {
//       fetchBatchCourseDetails();
//     }
//   }, [formData.batch, fetchBatchCourseDetails]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>
//   }

//   return (

//     <div className="space-y-6">
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Extra Course</CardTitle>
//             <CardDescription>Add an extra course to an existing batch</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">

//             {/* Course Selection */}
//             <div className="space-y-2">
//               <Label htmlFor="course">Course</Label>
//               <Select
//                 value={formData.course}
//                 onValueChange={(value) => handleCourseChange(value)}
//                 disabled={loading}
//               >
//                 <SelectTrigger id="course">
//                   <SelectValue placeholder="Select a course" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {loading ? (
//                     <SelectItem value="loading" disabled>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Loading courses...
//                     </SelectItem>
//                   ) : courses.length === 0 ? (
//                     <SelectItem value="none" disabled>No courses available</SelectItem>
//                   ) : (
//                     courses.map((course) => (
//                       <SelectItem key={course.id} value={course.id}>
//                         {course.name}
//                       </SelectItem>
//                     ))
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Year Selection */}
//             <div className="space-y-2">
//               <Label htmlFor="year">Year</Label>
//               <Select
//                 value={selectedYear.toString()}
//                 onValueChange={(value) => handleYearChange(parseInt(value))}
//                 disabled={!formData.course}
//               >
//                 <SelectTrigger id="year">
//                   <SelectValue placeholder="Select a year" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
//                     <SelectItem key={year} value={year.toString()}>
//                       {year}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Month Selection */}
//             <div className="space-y-2">
//               <Label htmlFor="month">Month</Label>
//               <Select
//                 value={formData.month.toString()}
//                 onValueChange={(value) => handleMonthChange(parseInt(value))}
//                 disabled={!formData.course}
//               >
//                 <SelectTrigger id="month">
//                   <SelectValue placeholder="Select a month" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {monthOptions.map(({ value, label }) => (
//                     <SelectItem key={value} value={value}>
//                       {label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Batch Selection */}
//             <div className="space-y-2">
//               <Label htmlFor="batch">Batch</Label>
//               <Select
//                 value={formData.batch}
//                 onValueChange={(value) => {
//                   if (!value) {
//                     setError('Please select a valid batch');
//                     return;
//                   }
//                   handleBatchChange(value);
//                 }}
//                 disabled={!formData.month || isLoadingBatches}
//               >
//                 <SelectTrigger id="batch">
//                   <SelectValue placeholder="Select a batch" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {isLoadingBatches ? (
//                     <SelectItem value="loading" disabled>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Loading batches...
//                     </SelectItem>
//                   ) : availableBatches.length === 0 ? (
//                     <SelectItem value="none" disabled>No batches available</SelectItem>
//                   ) : (
//                     availableBatches.map((batch) => (
//                       <SelectItem key={batch.id} value={batch.id}>
//                         {batch.name}
//                       </SelectItem>
//                     ))
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Extra Course Details */}
//             {formData.batch && (
//               <div className="space-y-4 pt-4 border-t">
//                 <h3 className="text-lg font-medium">Extra Course Details</h3>
//                 <div className="space-y-2">
//                   <Label htmlFor="course-name">Course Name</Label>
//                   <Input
//                     id="course-name"
//                     value={formData.courseName}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       courseName: e.target.value
//                     }))}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="lecturer-name">Lecturer Name</Label>
//                   <Input
//                     id="lecturer-name"
//                     value={formData.lecturerName}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       lecturerName: e.target.value
//                     }))}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="salary">Salary (₹)</Label>
//                   <Input
//                     id="salary"
//                     type="number"
//                     min="0"
//                     step="100"
//                     value={formData.salary || ''}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       salary: Number(e.target.value)
//                     }))}
//                     required
//                   />
//                 </div>
//               </div>
//             )}

//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {success && (
//               <Alert>
//                 <AlertDescription>{success}</AlertDescription>
//               </Alert>
//             )}
//           </CardContent>

//           <Button
//             type="submit"
//             className="w-full"
//             disabled={!formData.course || !formData.batch || !formData.courseName || !formData.lecturerName || isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Adding course...
//               </>
//             ) : (
//               'Add Extra Course'
//             )}
//           </Button>
//         </Card>
//       </form>

//       {/* Add Overview Section */}
//       {formData.batch && batchCourseDetails.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Batch Payment Overview</CardTitle>
//             <CardDescription>Current batch payment status and details</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {isLoadingDetails ? (
//                 <div className="flex justify-center items-center h-64">
//                   <Loader2 className="h-8 w-8 animate-spin" />
//                 </div>
//               ) : (
//                 batchCourseDetails.map((detail, index) => (
//                   <div key={index} className="border rounded-lg p-4 bg-gray-50">
//                     <div className="grid grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <Label>Course</Label>
//                         <div className="font-medium">{detail.courseName}</div>
//                       </div>
//                       <div>
//                         <Label>Lecturer</Label>
//                         <div className="font-medium">{detail.lecturerName}</div>
//                       </div>
//                       <div>
//                         <Label>Total Salary</Label>
//                         <div className="font-medium">{formatINR(detail.salary)}</div>
//                       </div>
//                       <div>
//                         <Label>Paid Amount</Label>
//                         <Input
//                           type="number"
//                           value={detail.paidAmount}
//                           onChange={(e) => {
//                             const newAmount = Number(e.target.value);
//                             if (newAmount >= 0 && newAmount <= detail.salary) {
//                               handleUpdatePayment(index, newAmount, detail.status);
//                             }
//                           }}
//                           className="mt-1"
//                         />
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label>Payment Status</Label>
//                         <div className="mt-1">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${detail.status === "Paid"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-yellow-100 text-yellow-800"
//                               }`}
//                           >
//                             {detail.status}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex space-x-2">
//                         <Button
//                           type="button"
//                           variant={detail.status === "Pending" ? "outline" : "secondary"}
//                           size="sm"
//                           onClick={() => handleUpdatePayment(index, detail.paidAmount, "Pending")}
//                         >
//                           Mark as Pending
//                         </Button>
//                         <Button
//                           type="button"
//                           variant={detail.status === "Paid" ? "outline" : "default"}
//                           size="sm"
//                           onClick={() => handleUpdatePayment(index, detail.salary, "Paid")}
//                         >
//                           Mark as Paid
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}

//               {/* Summary Card */}
//               <Card>
//                 <CardContent className="pt-6">
//                   <div className="grid grid-cols-3 gap-4">
//                     <div>
//                       <Label>Total Salary</Label>
//                       <div className="text-2xl font-bold">
//                         {formatINR(batchCourseDetails.reduce((sum, detail) => sum + detail.salary, 0))}
//                       </div>
//                     </div>
//                     <div>
//                       <Label>Total Paid</Label>
//                       <div className="text-2xl font-bold text-green-600">
//                         {formatINR(batchCourseDetails.reduce((sum, detail) => sum + detail.paidAmount, 0))}
//                       </div>
//                     </div>
//                     <div>
//                       <Label>Total Pending</Label>
//                       <div className="text-2xl font-bold text-yellow-600">
//                         {formatINR(
//                           batchCourseDetails.reduce((sum, detail) => sum + (detail.salary - detail.paidAmount), 0)
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//             <Button
//               type="button"
//               variant="default"
//               size="sm"
//               onClick={handleRefresh}
//             >
//               Refresh
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }



"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getMonthName } from "@/lib/utils"
import {
  getCourses,
  getAvailableBatches,
  addBatchCourse,
  getBatchDetails,
  API_BASE_URL
} from "@/lib/api"

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
}

type WorkStatus = "Not Started" | "In Progress" | "Incomplete" | "Complete";
type PaymentStatus = "Pending" | "Done";

interface BatchCourse {
  id: string
  name: string
  lectureName: string
  workStatus: WorkStatus
  paymentStatus: PaymentStatus
  salary: number
  paidAmount: number
}

export default function BatchDetailsManagement() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<BatchCourse, "id">>({
    name: "",
    lectureName: "",
    workStatus: "Not Started",
    paymentStatus: "Pending",
    salary: 0,
    paidAmount: 0,
  });

  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [addCourseData, setAddCourseData] = useState({
    name: "",
    lectureName: "",
    workStatus: "Not Started" as WorkStatus,
    paymentStatus: "Pending" as PaymentStatus,
    salary: 0,
  });

  const [formData, setFormData] = useState({
    course: "",
    month: 0,
    batch: "",
    courseName: "",
    lecturerName: "",
    salary: 0,
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

  useEffect(() => {
    const fetchBatches = async () => {
      if (!formData.course || !selectedYear || !formData.month) {
        setAvailableBatches([]);
        return;
      }
      try {
        setIsLoadingBatches(true);
        const batches = await getAvailableBatches(formData.course, selectedYear, formData.month);
        setAvailableBatches(batches);
        console.log('Fetched batches:', batches);
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
    alert(`Selected Course: ${courseId}`);
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
    alert(`Selected Month: ${month}`);
    setFormData(prevData => ({
      ...prevData,
      month,
      batch: ''
    }));
    setSelectedMonth(month);
    setAvailableBatches([]);
  };

  const handleYearChange = (year: number) => {
    alert(`Selected Year: ${year}`);
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

  const [batchCourses, setBatchCourses] = useState<BatchCourse[]>([]); // Add this state declaration

  const handleUpdateBatchCourse = useCallback(
    async (courseIndex: number, updates: Partial<BatchCourse>) => {
      if (updates.workStatus && !["Not Started", "In Progress", "Incomplete", "Complete"].includes(updates.workStatus as WorkStatus)) {
        setError("Invalid work status value");
        return;
      }

      try {
        // Ensure updateBatchCourse is imported or defined
        if (!selectedCourse || !selectedBatch) {
          setError('Please select a course and batch before updating a course');
          return;
        }
        await updateBatchCourse(selectedCourse, selectedBatch, courseIndex, updates);
        // Update local state
        setBatchCourses((prevCourses) => {
          const updatedCourses = [...prevCourses];
          updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], ...updates };
          return updatedCourses;
        });
      } catch (err) {
        console.error("Error updating batch course:", err);
        setError("Failed to update batch course. Please try again.");
      }
    },
    [selectedCourse, selectedBatch]
  );

  const handleDeleteBatchCourse = useCallback(
    async (courseId: string) => {
      try {
        await deleteBatchCourse(selectedCourse, selectedBatch, courseId)
        setBatchCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId))
      } catch (err) {
        console.error("Error deleting batch course:", err)
        setError("Failed to delete batch course. Please try again.")
      }
    },
    [selectedCourse, selectedBatch],
  )

  const handleAddBatchCourse = useCallback(async () => {
    if (!formData.batch) {
      setError('Please select a batch before adding a course');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await addBatchCourse(formData.course, formData.batch, newCourse);
      if (!response.ok) {
        throw new Error('Failed to add course to batch');
      }
      setSuccess('Course added successfully!');
      fetchBatchCourseDetails();
      setNewCourse({
        name: '',
        lectureName: '',
        workStatus: 'Not Started',
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

      // Log the course details being added
      console.log('Adding Extra Course Details:', {
        Course: formData.courseName,
        Lecturer: formData.lecturerName,
        Salary: formData.salary,
        Batch: formData.batch,
        Month: getMonthName(formData.month)
      });

      // Prepare course data
      const newCourse = {
        name: formData.courseName.trim(),
        lectureName: formData.lecturerName.trim(),
        workStatus: 'Not Started' as const,
        salary: formData.salary,
        paidAmount: 0,
        paymentStatus: 'Pending' as const
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
    // Always show all 12 months
    return Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      label: getMonthName(i + 1)
    }));
  }, []);

  // Add function to fetch batch course details

  const fetchBatchCourseDetails = useCallback(() => {
    if (!formData.batch) {
      console.error('Batch ID is not set');
      return;
    }

    console.log('Batch selected:', formData.batch);

    // Show the form for adding extra course
    setShowAddCourseForm(true);
  }, [formData.batch]);

  // Fetch details when batch changes
  useEffect(() => {
    if (formData.batch) {
      fetchBatchCourseDetails();
    }
  }, [formData.batch, fetchBatchCourseDetails]);


  // Fetch details when batch changes
  useEffect(() => {
    if (formData.batch) {
      fetchBatchCourseDetails();
    } else {
      setBatchCourseDetails([]);
    }
  }, [formData.batch, fetchBatchCourseDetails]);

  const handleUpdatePayment = async (index: number, paidAmount: number, status: "Pending" | "Paid") => {
    try {
      setError(null);
      setIsLoadingDetails(true);
      const detail = batchCourseDetails[index];

      if (!detail || !detail.id) {
        throw new Error('Invalid course details');
      }

      console.log('Updating payment:', { courseId: detail.id, paidAmount, status });
      await updateBatchPayment(detail.id, {
        paidAmount,
        paymentStatus: status
      });

      // Update local state
      const newDetails = [...batchCourseDetails];
      newDetails[index] = {
        ...newDetails[index],
        paidAmount,
        status
      };
      setBatchCourseDetails(newDetails);
      setSuccess('Payment status updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
      setError(errorMessage);
      console.error('Error updating payment:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Add refresh function
  const handleRefresh = useCallback(() => {
    if (formData.batch) {
      fetchBatchCourseDetails();
    }
  }, [formData.batch, fetchBatchCourseDetails]);

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
    <div className="space-y-6">
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
                {/* <SelectContent>
                  {isLoadingBatches ? (
                    <SelectItem value="loading" disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading batches...
                    </SelectItem>
                  ) : availableBatches.length === 0 ? (
                    <SelectItem value="none" disabled>No batches available</SelectItem>
                  ) : (
                    availableBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent> */}

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
                      <SelectItem key={batch._id} value={batch._id}> {/* Ensure this is unique */}
                        {batch.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Extra Course Details */}
            {formData.batch && showAddCourseForm && ( // Show form only if a batch is selected
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
                  <Label htmlFor="work-status">Work Status</Label>
                  <Input
                    id="work-status"
                    value={formData.workStatus}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      workStatus: e.target.value
                    }))}
                    required
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
                <div className="space-y-2">
                  <Label htmlFor="paid">Paid?</Label>
                  <Input
                    id="paid"
                    type="checkbox"
                    checked={formData.paidAmount > 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      paidAmount: e.target.checked ? formData.salary : 0 // Assuming full salary is paid if checked
                    }))}
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

      {/* Add Overview Section */}
      {formData.batch && batchCourseDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Payment Overview</CardTitle>
            <CardDescription>Current batch payment status and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoadingDetails ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                batchCourseDetails.map((detail, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Course</Label>
                        <div className="font-medium">{detail.courseName}</div>
                      </div>
                      <div>
                        <Label>Lecturer</Label>
                        <div className="font-medium">{detail.lecturerName}</div>
                      </div>
                      <div>
                        <Label>Total Salary</Label>
                        <div className="font-medium">{formatINR(detail.salary)}</div>
                      </div>
                      <div>
                        <Label>Paid Amount</Label>
                        <Input
                          type="number"
                          value={detail.paidAmount}
                          onChange={(e) => {
                            const newAmount = Number(e.target.value);
                            if (newAmount >= 0 && newAmount <= detail.salary) {
                              handleUpdatePayment(index, newAmount, detail.status);
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Payment Status</Label>
                        <div className="mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${detail.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {detail.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={detail.status === "Pending" ? "outline" : "secondary"}
                          size="sm"
                          onClick={() => handleUpdatePayment(index, detail.paidAmount, "Pending")}
                        >
                          Mark as Pending
                        </Button>
                        <Button
                          type="button"
                          variant={detail.status === "Paid" ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleUpdatePayment(index, detail.salary, "Paid")}
                        >
                          Mark as Paid
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Summary Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Total Salary</Label>
                      <div className="text-2xl font-bold">
                        {formatINR(batchCourseDetails.reduce((sum, detail) => sum + detail.salary, 0))}
                      </div>
                    </div>
                    <div>
                      <Label>Total Paid</Label>
                      <div className="text-2xl font-bold text-green-600">
                        {formatINR(batchCourseDetails.reduce((sum, detail) => sum + detail.paidAmount, 0))}
                      </div>
                    </div>
                    <div>
                      <Label>Total Pending</Label>
                      <div className="text-2xl font-bold text-yellow-600">
                        {formatINR(
                          batchCourseDetails.reduce((sum, detail) => sum + (detail.salary - detail.paidAmount), 0)
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}