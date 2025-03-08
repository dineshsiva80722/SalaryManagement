// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { getCourse } from '@/lib/api'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import dynamic from 'next/dynamic'
// const BatchManagement = dynamic(() => import('@/components/BatchManagement'), { ssr: false })
// import { useAuth } from '@/lib/auth-context'

// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ]

// export default function CourseCalendar({ params }) {
//   const [course, setCourse] = useState(null)
//   const router = useRouter()
//   const { user } = useAuth()

//   useEffect(() => {
//     const fetchCourse = async () => {
//       const fetchedCourse = await getCourse(params.courseId)
//       setCourse(fetchedCourse)
//     }
//     fetchCourse()
//   }, [params.courseId])

//   if (!course) return <div>Loading...</div>

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">{course.name} - Course Management</h1>
//       {typeof window !== 'undefined' && user && user.role === 'admin' && (
//         <BatchManagement courseId={params.courseId} />
//       )}
//       <h2 className="text-2xl font-bold mt-8 mb-4">Yearly Calendar</h2>
//       <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
//         {months.map((month, index) => (
//           <Button key={month} asChild variant="outline" className="h-24">
//             <Link href={`/course/${params.courseId}/${index + 1}`}>
//               {month}
//             </Link>
//           </Button>
//         ))}
//       </div>
//     </div>
//   )
// }

