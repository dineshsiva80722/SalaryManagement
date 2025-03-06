"use client"

import { useState, useEffect } from "react"
import { getCourses, createCourse, updateCourse, deleteCourse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface Course {
  id: string
  name: string
  description: string
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourse, setNewCourse] = useState({ name: "", description: "" })
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedCourses = await getCourses()
      if (!Array.isArray(fetchedCourses)) {
        throw new Error('Invalid response format')
      }
      setCourses(fetchedCourses)
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError("Failed to fetch courses. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      setError(null)
      if (!newCourse.name || !newCourse.description) {
        throw new Error("Course name and description are required")
      }
      const createdCourse = await createCourse(newCourse)
      if (!createdCourse) {
        throw new Error("Failed to create course")
      }
      setNewCourse({ name: "", description: "" })
      await fetchCourses()
    } catch (err) {
      console.error("Error creating course:", err)
      setError(err instanceof Error ? err.message : "Failed to create course. Please try again.")
    }
  }

  // const handleUpdateCourse = async (e: React.MouseEvent) => {
  //   e.preventDefault()
  //   if (!editingCourse) return
    
  //   try {
  //     setError(null)
  //     if (!editingCourse.name || !editingCourse.description) {
  //       throw new Error("Course name and description are required")
  //     }
  //     const updatedCourse = await updateCourse(editingCourse.id, editingCourse)
  //     if (!updatedCourse) {
  //       throw new Error("Failed to update course")
  //     }
  //     setEditingCourse(null)
  //     await fetchCourses()
  //   } catch (err) {
  //     console.error("Error updating course:", err)
  //     setError(err instanceof Error ? err.message : "Failed to update course. Please try again.")
  //   }
  // }
const handleUpdateCourse = async (e: React.MouseEvent) => {
  e.preventDefault();
  if (!editingCourse) return;

  try {
    setError(null);

    // Validation
    if (!editingCourse.name || !editingCourse.description) {
      throw new Error("Course name and description are required");
    }

    // Ensure correct course ID
    const courseId = editingCourse._id || editingCourse.id;
    if (!courseId) {
      throw new Error("Invalid course ID");
    }

    // ✅ Update course
    const updatedCourse = await updateCourse(courseId, editingCourse);
    if (!updatedCourse) {
      throw new Error("Failed to update course");
    }

    // Reset state after successful update
    setEditingCourse(null);

    // ✅ Fetch updated course list
    fetchCourses().catch(err => console.error("Error fetching courses:", err));
  } catch (err) {
    console.error("Error updating course:", err);
    setError(err instanceof Error ? err.message : "Failed to update course. Please try again.");
  }
};


  // const handleDeleteCourse = async (id: string) => {
  //   if (!window.confirm("Are you sure you want to delete this course?")) return
    
  //   try {
  //     setError(null)
  //     const result = await deleteCourse(id)
  //     if (!result) {
  //       throw new Error("Failed to delete course")
  //     }
  //     await fetchCourses()
  //   } catch (err) {
  //     console.error("Error deleting course:", err)
  //     setError("Failed to delete course. Please try again.")
  //   }
  // }


  const handleDeleteCourse = async (courseId: string) => {
    console.log("Attempting to delete course with ID:", courseId); // Debugging line
  
    if (!courseId) {
      console.error("Invalid course ID format");
      return;
    }
  
    try {
      await deleteCourse(courseId);
      await fetchCourses(); // Refresh the course list after deletion
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

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
      <h2 className="text-2xl font-bold mb-4">Course Management</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Course</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateCourse}>Save Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingCourse(course)
                    setError(null)
                  }}>
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                  </DialogHeader>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="edit-name"
                        value={editingCourse?.name || ""}
                        onChange={(e) => setEditingCourse({ ...editingCourse!, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="edit-description"
                        value={editingCourse?.description || ""}
                        onChange={(e) => setEditingCourse({ ...editingCourse!, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleUpdateCourse}>Update Course</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
                        <Button variant="destructive" onClick={() => {
            console.log(course.id);
            handleDeleteCourse(course._id);
          }}>
            Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
    
}

