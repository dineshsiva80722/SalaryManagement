const API_URL = 'http://localhost:5000/api';

export async function getCourses() {
  const response = await fetch(`${API_URL}/courses`);
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}

export async function createCourse(data: { name: string; description: string }) {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create course');
  }

  return response.json();
}

export async function updateCourse(courseId: string, data: { name?: string; description?: string }) {
  if (!courseId) {
    throw new Error('Course ID is required');
  }

  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update course');
  }

  return response.json();
}

export async function deleteCourse(courseId: string) {
  if (!courseId) {
    throw new Error('Course ID is required');
  }

  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete course');
  }

  return response.json();
} 