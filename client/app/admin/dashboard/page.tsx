// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useAuth } from "@/lib/auth-context"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import CourseManagement from "@/components/CourseManagement"
// import BatchManagement from "@/components/BatchManagement"
// import BatchDetailsManagement from "@/components/BatchDetailsManagement"
// import BatchSalaryOverview from "@/components/BatchSalaryOverview"

// export default function AdminDashboard() {
//   const router = useRouter()
//   const { user, logout } = useAuth()

//   useEffect(() => {
//     if (!user || user.role !== "admin") {
//       router.push("/login")
//     }
//   }, [user, router])

//   if (!user || user.role !== "admin") return null

//   return (
//     <main className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <Button onClick={logout}>Logout</Button>
//       </div>
//       <Tabs defaultValue="overview">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="courses">Courses</TabsTrigger>
//           <TabsTrigger value="batches">Batches</TabsTrigger>
//           <TabsTrigger value="batchDetails">Batch Details</TabsTrigger>
//         </TabsList>
//         <TabsContent value="overview">
//           <BatchSalaryOverview />
//         </TabsContent>
//         <TabsContent value="courses">
//           <CourseManagement />
//         </TabsContent>
//         <TabsContent value="batches">
//           <BatchManagement />
//         </TabsContent>
//         <TabsContent value="batchDetails">
//           <BatchDetailsManagement />
//         </TabsContent>
//       </Tabs>
//     </main>
//   )
// }


// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useAuth } from "@/lib/auth-context"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import CourseManagement from "@/components/CourseManagement"
// import BatchManagement from "@/components/BatchManagement"
// import BatchDetailsManagement from "@/components/BatchDetailsManagement"
// import BatchSalaryOverview from "@/components/BatchSalaryOverview"

// export default function AdminDashboard() {
//   const router = useRouter()
//   const { user, logout } = useAuth()

//   useEffect(() => {
//     if (!user || user.role !== "admin") {
//       router.push("/login")
//     }
//   }, [user, router])

//   if (!user || user.role !== "admin") return null

//   // Mock data for total and pending payments (replace with actual data as needed)
//   const totalPayment = 10000; // Example total payment
//   const pendingPayments = 2000; // Example pending payments

//   return (
//     <main className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <Button onClick={logout}>Logout</Button>
//       </div>
//       <Tabs defaultValue="overview">
//         <TabsList>
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="courses">Courses</TabsTrigger>
//           <TabsTrigger value="batches">Batches</TabsTrigger>
//           <TabsTrigger value="batchDetails">Batch Details</TabsTrigger>
//         </TabsList>
//         <TabsContent value="overview">
//           {/* Payment Details Section */}
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold">Overall Payment Details</h2>
//             <div className="mt-2">
//               <p className="text-lg">Total Payment: <strong>${totalPayment}</strong></p>
//               <p className="text-lg">Pending Payments: <strong>${pendingPayments}</strong></p>
//             </div>
//             <BatchSalaryOverview />
//           </div>
//           {/* Other Overview Content */}
//         </TabsContent>
//         <TabsContent value="courses">
//           <CourseManagement />
//         </TabsContent>
//         <TabsContent value="batches">
//           <BatchManagement />
//         </TabsContent>
//         <TabsContent value="batchDetails">
//           <BatchDetailsManagement />
//         </TabsContent>
//       </Tabs>
//     </main>
//   )
// }
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseManagement from "@/components/CourseManagement"
import BatchManagement from "@/components/BatchManagement"
import BatchDetailsManagement from "@/components/BatchDetailsManagement"
import BatchSalaryOverview from "@/components/BatchSalaryOverview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login")
    }
  }, [user, router])

  if (!user || user.role !== "admin") return null

  // Mock data for total and pending payments (replace with actual data as needed)


  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="batchDetails">Batch Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
       
          <BatchSalaryOverview />
        </TabsContent>
        <TabsContent value="courses">
          <CourseManagement />
        </TabsContent>
        <TabsContent value="batches">
          <BatchManagement />
        </TabsContent>
        <TabsContent value="batchDetails">
          <BatchDetailsManagement />
        </TabsContent>
      </Tabs>
    </main>
  )
}