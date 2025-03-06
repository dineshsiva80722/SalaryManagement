// // 'use client'

// // import { useEffect, useState } from 'react'
// // import { useRouter } from 'next/navigation'
// // import { useAuth } from '@/lib/auth-context'
// // import { getCourses } from '@/lib/api'
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Loader2 } from 'lucide-react'
// // import MonthlyScheduleTable from '@/components/MonthlyScheduleTable'
// // import BatchSelector from '@/components/BatchSelector'
// // import BatchDetails from '@/components/BatchDetails'
// // import { ScheduleItem } from '@/components/MonthlyScheduleTable'

// // interface Course {
// //   id: string
// //   name: string
// //   description: string
// // }

// // export default function UserDashboard() {
// //   const router = useRouter()
// //   const { user, logout } = useAuth()
// //   const [courses, setCourses] = useState<Course[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState<string | null>(null)
// //   const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
// //   const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
// //   const currentYear = new Date().getFullYear()
// //   const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
// //   const [schedule, setSchedule] = useState<ScheduleItem[]>([])

// //   useEffect(() => {
// //     fetchCourses()
// //     console.log('Courses:', courses);
// //   }, [])

// //   const fetchCourses = async () => {
// //     try {
// //         setLoading(true);
// //         const fetchedCourses = await getCourses();
// //         console.log('Fetched Courses:', fetchedCourses); // Check the structure here
// //         setCourses(fetchedCourses);
// //     } catch (err) {
// //         setError('Failed to fetch courses. Please try again later.');
// //         console.error('Error fetching courses:', err);
// //     } finally {
// //         setLoading(false);
// //     }
// // };



// //   const handleCourseSelect = (courseId: string) => {
// //     console.log('Selected Course ID:', courseId); // Debugging line
// //     setSelectedCourse(courseId);
// //     setSelectedMonth(null);
// //     setSelectedBatch(null);
// //   };

// //   const handleMonthSelect = (month: number) => {
// //     setSelectedMonth(month);
// //     setSelectedBatch(null);
// //   }

// //   const handleBatchSelect = (batchId: string) => {
// //     setSelectedBatch(batchId)
// //   }

// //   return (
// //     <main className="container mx-auto p-4">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-3xl font-bold">User Dashboard</h1>
// //         <Button onClick={logout}>Logout</Button>
// //       </div>
// //       {loading ? (
// //         <div className="flex justify-center items-center h-64">
// //           <Loader2 className="h-8 w-8 animate-spin" />
// //         </div>
// //       ) : error ? (
// //         <div className="text-center text-red-500">{error}</div>
// //       ) : (
// //         <div className="grid grid-cols-1 gap-6">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Your Courses</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //                 {courses.map((course) => (
// //                   <Button
// //                     key={course.id}
// //                     onClick={() => handleCourseSelect(course.id)} // Ensure course.id is defined
// //                     variant={selectedCourse === course.id ? "default" : "outline"}
// //                   >
// //                     {course.name}

// //                   </Button>
// //                 ))}
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {selectedCourse && (
// //             <MonthlyScheduleTable
// //               schedule={schedule}
// //               courseId={selectedCourse}
// //               onSelectMonth={handleMonthSelect}
// //               selectedMonth={selectedMonth}
// //             />
// //           )}

// //           {selectedCourse && selectedMonth && (
// //             <BatchSelector
// //               courseId={selectedCourse}
// //               month={selectedMonth}
// //               onSelectBatch={handleBatchSelect}
// //               selectedBatch={selectedBatch}
// //             />
// //           )}

// //           {selectedCourse && selectedMonth && selectedBatch && (
// //             <BatchDetails
// //               courseId={selectedCourse}
// //               month={selectedMonth}
// //               year={currentYear}
// //               batchId={selectedBatch}
// //             />
// //           )}
// //         </div>
// //       )}
// //     </main>
// //   )
// // }



'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getCourses } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import MonthlyScheduleTable from '@/components/MonthlyScheduleTable';
import BatchSelector from '@/components/BatchSelector';
import BatchDetails from '@/components/BatchDetails';
import { ScheduleItem } from '@/components/MonthlyScheduleTable';

interface Course {
  id: string;
  name: string;
  description: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const currentYear = new Date().getFullYear();
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await getCourses();
      console.log('Fetched Courses:', fetchedCourses); // Check the structure here
      setCourses(fetchedCourses);
    } catch (err) {
      setError('Failed to fetch courses. Please try again later.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    console.log('Selected Course ID:', courseId); // Debugging line
    setSelectedCourse(courseId);
    setSelectedMonth(null);
    setSelectedBatch(null);
};


  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setSelectedBatch(null);
  };

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatch(batchId);
  };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Button
                    key={course.id}
                    onClick={() => handleCourseSelect(course.id)} // Ensure course.id is defined
                    variant={selectedCourse === course.id ? "default" : "outline"}
                  >
                    {course.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedCourse && (
            <MonthlyScheduleTable
              schedule={schedule}
              courseId={selectedCourse}
              onSelectMonth={handleMonthSelect}
              selectedMonth={selectedMonth}
            />
          )}

          {selectedCourse && selectedMonth && (
            <BatchSelector
              courseId={selectedCourse}
              month={selectedMonth}
              onSelectBatch={handleBatchSelect}
              selectedBatch={selectedBatch}
            />
          )}

          {selectedCourse && selectedMonth && selectedBatch && (
            <BatchDetails
              courseId={selectedCourse}
              month={selectedMonth}
              year={currentYear}
              batchId={selectedBatch}
            />
          )}
        </div>
      )}
    </main>
  );
}





// 'use client'

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth-context';
// import { getCourses } from '@/lib/api';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2 } from 'lucide-react';
// import MonthlyScheduleTable from '@/components/MonthlyScheduleTable';
// import BatchSelector from '@/components/BatchSelector';
// import BatchDetails from '@/components/BatchDetails';
// import { ScheduleItem } from '@/components/MonthlyScheduleTable';

// interface Course {
//   id: string;
//   name: string;
//   description: string;
// }

// export default function UserDashboard() {
//   const router = useRouter();
//   const { user, logout } = useAuth();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
//   const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
//   const currentYear = new Date().getFullYear();
//   const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
//   const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const fetchedCourses = await getCourses();
//       console.log('Fetched Courses:', fetchedCourses); // Check the structure here
//       setCourses(fetchedCourses);
//     } catch (err) {
//       setError('Failed to fetch courses. Please try again later.');
//       console.error('Error fetching courses:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCourseSelect = (courseId: string) => {
//     console.log('Selected Course ID:', courseId); // Debugging line
//     setSelectedCourse(courseId);
//     setSelectedMonth(null);
//     setSelectedBatch(null);
//   };

//   const handleMonthSelect = (month: number) => {
//     setSelectedMonth(month);
//     setSelectedBatch(null);
//   };

//   const handleBatchSelect = (batchId: string) => {
//     setSelectedBatch(batchId);
//   };

//   return (
//     <main className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">User Dashboard</h1>
//         <Button onClick={logout}>Logout</Button>
//       </div>
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin" />
//         </div>
//       ) : error ? (
//         <div className="text-center text-red-500">{error}</div>
//       ) : (
//         <div className="grid grid-cols-1 gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Your Courses</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {courses.map((course) => (
//                   <Button
//                     key={course.id}
//                     onClick={() => handleCourseSelect(course.id)} // Ensure course.id is defined
//                     variant={selectedCourse === course.id ? "default" : "outline"}
//                   >
//                     {course.name}
//                   </Button>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {selectedCourse && (
//             <MonthlyScheduleTable
//               schedule={schedule}
//               courseId={selectedCourse}
//               onSelectMonth={handleMonthSelect}
//               selectedMonth={selectedMonth}
//             />
//           )}

//           {selectedCourse && selectedMonth && (
//             <BatchSelector
//               courseId={selectedCourse}
//               month={selectedMonth}
//               onSelectBatch={handleBatchSelect}
//               selectedBatch={selectedBatch}
//             />
//           )}

//           {selectedCourse && selectedMonth && selectedBatch && (
//             <BatchDetails
//               courseId={selectedCourse}
//               month={selectedMonth}
//               year={currentYear}
//               batchId={selectedBatch}
//             />
//           )}
//         </div>
//       )}
//     </main>
//   );
// }
