// This is a mock API module. In a real application, you would replace these
// functions with actual API calls to your backend.

export interface Course {
  id: string
  name: string
  description: string
  batches: Batch[]
}

interface Staff {
  id: string
  name: string
}


type PaymentStatus = "Pending" | "Done";

interface BatchCourse {
  id: string
  name: string
  lectureName: string
  salary: number
  paidAmount: number
  paymentStatus: PaymentStatus
  paymentScreenshot?: string
}

interface Batch {
  id: string
  name: string
  month: number
  year: number
  courseId: string
  courses: BatchCourse[]
}



interface User {
  id: string
  username: string
  role: "superadmin" | "admin" | "lecturer"
}

interface BatchSalaryData {
  id: string
  courseName: string
  batchName: string
  year: number
  month: number
  lecturerName: string
  lecturerCourseName: string
  salary: number
  paidAmount: number
  status: "Pending" | "Paid"
}

export interface BatchDetail {
  id: string
  courseName: string
  lectureName: string
  paymentStatus: string
  salary: number
  paidAmount: number
  paymentScreenshot?: string
}

const API_BASE_URL = 'http://localhost:5000/api';

let courses: Course[] = [
  {
    id: "1",
    name: "Web Development",
    description: "Learn web development fundamentals",
    batches: [
      {
        id: "1",
        name: "Batch A",
        month: 1,
        year: 2024,
        courseId: "1",
        courses: [
          {
            id: "1",
            name: "HTML",
            lectureName: "John Doe",
            salary: 1000,
            paidAmount: 1000,
            paymentStatus: "Done",
          },
          {
            id: "2",
            name: "CSS",
            lectureName: "Jane Smith",
            salary: 1200,
            paidAmount: 600,
            paymentStatus: "Pending",
          },
          {
            id: "3",
            name: "JavaScript",
            lectureName: "Bob Johnson",
            salary: 800,
            paidAmount: 0,
            paymentStatus: "Pending",
          },
        ],
      },
      {
        id: "2",
        name: "Batch B",
        month: 2,
        year: 2024,
        courseId: "1",
        courses: [
          {
            id: "4",
            name: "React",
            lectureName: "Alice Brown",
            salary: 1500,
            paidAmount: 0,
            paymentStatus: "Pending",
          },
          {
            id: "5",
            name: "Node.js",
            lectureName: "Charlie Green",
            salary: 1300,
            paidAmount: 0,
            paymentStatus: "Pending",
          },
        ],
      },
    ],
  },
]

const staff: Staff[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
  { id: "4", name: "Alice Brown" },
  { id: "5", name: "Charlie Green" },
]

const users: User[] = [
  { id: "1", username: "superadmin", role: "superadmin" },
  { id: "2", username: "admin", role: "admin" },
  { id: "3", username: "lecturer", role: "lecturer" },
]

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_BASE_URL}/courses`);
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
}

export async function getCourse(id: string): Promise<Course | undefined> {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch course');
  }
  return response.json();
}


export async function createCourse(course: Omit<Course, "id" | "batches">): Promise<Course> {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
  });
  if (!response.ok) {
    throw new Error('Failed to create course');
  }
  return response.json();
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<Course | undefined> {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update course');
  }
  return response.json();
}

// export async function deleteCourse(id: string): Promise<void> {
//   console.log(id);
//   const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ message: 'Failed to delete course' }));
//     throw new Error(errorData.message || 'Failed to delete course');
//   }
// }

export async function deleteCourse(id: string): Promise<void> {
  console.log("Deleting course with ID:", id);
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Failed to delete course" }));
    throw new Error(errorData.message || "Failed to delete course");
  }
}


export async function getBatches(courseId: string, year?: number, month?: number): Promise<Batch[]> {
  let url = `${API_BASE_URL}/courses/${courseId}/batches`;

  // Add query parameters if year or month is provided
  const params = new URLSearchParams();
  if (year !== undefined) params.append('year', year.toString());
  if (month !== undefined) params.append('month', month.toString());
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch batches');
  }
  return response.json();
}

export async function createBatch(batch: Omit<Batch, "id" | "courses">): Promise<Batch> {
  console.log(batch);
  const response = await fetch(`${API_BASE_URL}/batches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batch),
  });
  if (!response.ok) {
    throw new Error('Failed to create batch');
  }
  return response.json();
}

// export async function updateBatch(id: string, updates: Partial<Batch>): Promise<Batch | undefined> {
//   const response = await fetch(`${API_BASE_URL}/batch-details/${id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(updates),
//   });
//   if (!response.ok) {
//     throw new Error('Failed to update batch');
//   }
//   return response.json();
// }

// export async function updateBatch(courseId: string, id: string, updates: Partial<Batch>): Promise<Batch | undefined> {
//   console.log(courseId, id, updates);
//   const response = await fetch(`${API_BASE_URL}/courses/${courseId}/batches/${id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(updates),
//   });

//   if (!response.ok) {
//     const errorMessage = await response.text();
//     throw new Error(`Failed to update batch: ${errorMessage}`);
//   }

//   return response.json();
// }

export async function updateBatch(
  courseId: string,
  batchId: string,
  updates: Partial<Batch>
): Promise<Batch | undefined> {
  console.log("🔄 Sending update request for batch:", { courseId, batchId, updates });

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/batches/${batchId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates), // ✅ Only send necessary data
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to update batch: ${errorMessage}`);
  }

  return response.json();
}



// export async function deleteBatch(id: string): Promise<void> {
//   const response = await fetch(`${API_BASE_URL}/batches/${id}`, {
//     method: 'DELETE',
//   });
//   if (!response.ok) {
//     throw new Error('Failed to delete batch');
//   }
// }

// export async function deleteBatch(id: string): Promise<void> {
//   console.log("Deleting batch with ID:", id);
//   const response = await fetch(`${API_BASE_URL}/batches/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ message: "Failed to delete batch" }));
//     throw new Error(errorData.message || "Failed to delete batch");
//   }
// }

// export const deleteBatch = async (batchId: string, courseId: string) => {
//   const response = await fetch(`${API_BASE_URL}/courses/${courseId}/batches/${batchId}`, {
//     method: 'DELETE',
//   });
//   if (!response.ok) {
//     throw new Error('Failed to delete batch');
//   }
//   return response.json();
// };

export const deleteBatch = async (courseId: string, batchId: string) => {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/batches/${batchId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete batch: ${errorMessage}`);
  }

  return response.json();
};


// export async function deleteBatch(courseId: string, batchId: string): Promise<void> {
//   console.log("Deleting batch with ID:", batchId, "for course:", courseId);
//   console.log(`${API_BASE_URL}/courses/${courseId}/batches/${batchId}`);

//   const response = await fetch(`${API_BASE_URL}/courses/${courseId}/batches/${batchId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({ message: "Failed to delete batch" }));
//     throw new Error(errorData.message || "Failed to delete batch");
//   }
// }


export async function getMonthlyBatches(courseId: string, month: string): Promise<Batch[]> {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/batches/${month}`);
  if (!response.ok) {
    throw new Error('Failed to fetch monthly batches');
  }
  return response.json();
}

export async function getStaff(): Promise<Staff[]> {
  const response = await fetch(`${API_BASE_URL}/staff`);
  if (!response.ok) {
    throw new Error('Failed to fetch staff');
  }
  return response.json();
}

export async function uploadPaymentScreenshot(id: string, file: File): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/payment-screenshots`, {
    method: 'POST',
    body: file,
  });
  if (!response.ok) {
    throw new Error('Failed to upload payment screenshot');
  }
  return response.json();
}


export async function getBatchDetails(
  courseId: string,
  year: string | number,
  month: string | number,
  batchId: string,
): Promise<BatchCourse[]> {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/batches/${batchId}/details`);
  if (!response.ok) {
    throw new Error('Failed to fetch batch details');
  }
  return response.json();
}



// export async function updateBatchCourse(
//   courseId: string,
//   batchId: string,
//   courseIndex: number,
//   updates: Partial<BatchCourse>,
// ): Promise<void> {
//   const response = await fetch(
//     `${API_BASE_URL}/courses/${courseId}/batches/${batchId}/courses/${courseIndex}`,
//     {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updates),
//     }
//   );
//   if (!response.ok) {
//     throw new Error('Failed to update batch course');
//   }
// }

// Example of updateBatchCourse function
// export const updateBatchCourse = async (courseId: string, updates: Partial<BatchCourse>, batchId: string, courseIndex: number) => {
//   const response = await fetch(`/api/courses/${courseId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ updates, batchId, courseIndex }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to update batch course");
//   }

//   return await response.json();
// };

// Example of updateBatchCourse function
export const updateBatchCourse = async (courseId: string, updates: Partial<BatchCourse>, batchId: string, courseIndex: number) => {
  const response = await fetch(`/api/courses/${courseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updates, batchId, courseIndex }),
  });

  if (!response.ok) {
    throw new Error("Failed to update batch course");
  }

  return await response.json();
};

export async function deleteBatchCourse(
  courseId: string,
  batchId: string,
  courseId2: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/courses/${courseId}/batches/${batchId}/courses/${courseId2}`,
    {
      method: 'DELETE',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to delete batch course');
  }
}

// export async function addBatchCourse(
//   courseId: string,
//   batchId: string,
//   newCourse: Omit<BatchCourse, "id">,
// ): Promise<BatchCourse> {
//   const response = await fetch(
//     `${API_BASE_URL}/courses/${courseId}/batches/${batchId}/courses`,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newCourse),
//     }
//   );
//   if (!response.ok) {
//     throw new Error('Failed to add batch course');
//   }
//   return response.json();
// }

export async function addBatchCourse(
  courseId: string,
  batchId: string,
  newCourse: Omit<BatchCourse, "id">,
): Promise<BatchCourse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/courses/${courseId}/batches/${batchId}/courses`, // Ensure correct URL structure
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text(); // Get error details from response
      throw new Error(`Failed to add batch course: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding batch course:", error);
    throw error;
  }
}


export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return response.json();
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}

export async function getLecturerBatches(
  lecturerId: string,
  year: number,
  month: number,
): Promise<{ id: string; name: string }[]> {
  const response = await fetch(`${API_BASE_URL}/lecturers/${lecturerId}/batches`);
  if (!response.ok) {
    throw new Error('Failed to fetch lecturer batches');
  }
  return response.json();
}

export async function updateLecturerBatchCourse(
  lecturerId: string,
  batchId: string,
  courseId: string,
  updates: Partial<BatchCourse>,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/lecturers/${lecturerId}/batches/${batchId}/courses/${courseId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to update lecturer batch course');
  }
}

export async function getLecturerMonths(lecturerId: string): Promise<number[]> {
  const response = await fetch(`${API_BASE_URL}/lecturers/${lecturerId}/months`);
  if (!response.ok) {
    throw new Error('Failed to fetch lecturer months');
  }
  return response.json();
}

export async function getLecturerBatchDetails(lecturerId: string, batchId: string): Promise<BatchCourse[]> {
  const response = await fetch(`${API_BASE_URL}/lecturers/${lecturerId}/batches/${batchId}/details`);
  if (!response.ok) {
    throw new Error('Failed to fetch lecturer batch details');
  }
  return response.json();
}

export async function checkUserExists(username: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/users/exists/${username}`);
  if (!response.ok) {
    throw new Error('Failed to check user existence');
  }
  return response.json();
}

export async function getLecturerYears(lecturerId: string): Promise<number[]> {
  const response = await fetch(`${API_BASE_URL}/lecturers/${lecturerId}/years`);
  if (!response.ok) {
    throw new Error('Failed to fetch lecturer years');
  }
  return response.json();
}

export async function getBatchSalaryData(): Promise<BatchSalaryData[]> {
  const response = await fetch(`${API_BASE_URL}/batch-salary-data`);
  if (!response.ok) {
    throw new Error('Failed to fetch batch salary data');
  }
  return response.json();
}




export async function updateBatchDetail(
  id: string,
  updates: Partial<BatchDetail>
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/batch-details/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to update batch detail' }));
    throw new Error(errorData.message || 'Failed to update batch detail');
  }
}

export async function getAvailableMonths(courseId: string, year: number): Promise<number[]> {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/months?year=${year}`);
  if (!response.ok) {
    throw new Error('Failed to fetch available months');
  }
  return response.json();
}

export async function getAvailableBatches(courseId: string, year: number, month: number): Promise<Batch[]> {
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/batches?year=${year}&month=${month}`);

  if (!response.ok) {
    throw new Error('Failed to fetch available batches');
  }
  return response.json();
}



export async function fetchSchedule() {
  try {
    const response = await fetch('/api/schedule');
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

export async function updateScheduleItem(id: string, data: any): Promise<void> {
  try {
    const response = await fetch(`/api/schedule/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update schedule item');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating schedule item:', error);
  }
}

interface extracourse {
  id: string
  name: string
  lectureName: string
  salary: number
  paidAmount: number
  paymentStatus: PaymentStatus
  paymentScreenshot?: string
}

// export async function getExtraCourseDetails(courseId: string, batchId: string): Promise<extracourse> {
//   const response = await fetch(`${API_BASE_URL}/extracourse/${courseId}/${batchId}`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch extra course details');
//   }
//   return response.json();
// }

// export async function deleteExtraCourse(courseId: string, batchId: string): Promise<{ message: string }> {
//   const response = await fetch(`${API_BASE_URL}/extracourse/${courseId}/${batchId}`, {
//     method: 'DELETE',
//     headers: { 'Content-Type': 'application/json' },
//   });
//   if (!response.ok) {
//     throw new Error('Failed to delete extra course');
//   }
//   return response.json();
// }

// export async function deleteExtraCourse(courseId: string, batchId: string): Promise<{ message: string }> {
//   try {
//     const response = await fetch(`/api/extracourse/${courseId}/${batchId}`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to delete extra course');
//     }

//     return await response.json(); // Assuming the response returns a message
//   } catch (error) {
//     console.error('Error deleting extra course:', error);
//     throw error; // Rethrow the error for further handling if needed
//   }
// }


// batchid
export async function getExtraCourseDetails(courseId: string, batchId: string): Promise<any> {
  try {
    const response = await fetch(`/api/extracourse/${courseId}/${batchId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch extra course details');
    }

    return await response.json(); // Assuming the response returns the extra course details
  } catch (error) {
    console.error('Error fetching extra course details:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}


export async function getAllBatches(): Promise<Batch[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/batches`); // Adjust the URL as necessary
    if (!response.ok) {
      throw new Error('Failed to fetch batches');
    }
    return await response.json(); // Assuming the response returns an array of batches
  } catch (error) {
    console.error('Error fetching batches:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}

export async function deleteExtraCourse(courseId: string, batchId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`/api/extracourse/${courseId}/${batchId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to delete extra course');
    }

    return await response.json(); // Assuming the response returns a message
  } catch (error) {
    console.error('Error deleting extra course:', error);
    throw error; // Rethrow the error for further handling if needed
  }
}

export async function getExtraCourseIds(courseId: string, batchId: string): Promise<string[]> {
  try {
    const response = await fetch(`/api/extracourse/${courseId}/${batchId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch extra course details');
    }

    const data = await response.json();
    return data.courseIds; // Return only course IDs
  } catch (error) {
    console.error('Error fetching extra course details:', error);
    throw error;
  }
}
