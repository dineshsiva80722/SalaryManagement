"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseManagement from "@/components/CourseManagement"
import BatchManagement from "@/components/BatchManagement"
import BatchDetailsManagement from "@/components/BatchDetailsManagement"
import UserManagement from "@/components/UserManagement"
import BatchSalaryOverview from "@/components/BatchSalaryOverview"

export default function SuperAdminDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user || user.role !== "superadmin") {
      router.push("/login")
    }
  }, [user, router])

  if (!user || user.role !== "superadmin") return null

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="batchDetails">Batch Details</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
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
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </main>
  )
}

