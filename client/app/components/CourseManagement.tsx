import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api';

interface Course {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (data: { name: string; description: string }) => {
    try {
      await createCourse(data);
      fetchCourses(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    }
  };

  const handleUpdateCourse = async (courseId: string, data: { name?: string; description?: string }) => {
    try {
      await updateCourse(courseId, data);
      fetchCourses(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      fetchCourses(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // Your JSX here
  );
} 