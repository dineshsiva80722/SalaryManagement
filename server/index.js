import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectPayrollDB from './db.js';
import { Course, BatchSalary, Payroll } from './models/payroll.js';
import User from './models/user.js';

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectPayrollDB();

// Get all payroll records
app.get('/api/payroll', async (req, res) => {
  try {
    const payrolls = await Payroll.find();
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Add new payroll record
app.post('/api/payroll', async (req, res) => {
  const payroll = new Payroll({
    employeeId: req.body.employeeId,
    salary: req.body.salary,
    status: req.body.status
  });

  try {
    const newPayroll = await payroll.save();
    res.status(201).json(newPayroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a route to create users
app.post('/api/users', async (req, res) => {
  try {
    console.log('Received user creation request:', req.body);

    const user = new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role
    });

    console.log('Created user model:', user);
    const newUser = await user.save();
    console.log('Saved user to database:', newUser);

    // Verify the user was created
    const savedUser = await User.findById(newUser._id);
    console.log('Retrieved saved user:', savedUser);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/save-course-details', async (req, res) => {
  const { courseName, lecturerName, salary, paidAmount, paymentStatus } = req.body;

  const newCourseDetail = new CourseDetail({
    courseName,
    lecturerName,
    salary,
    paidAmount,
    paymentStatus,
  });

  try {
    await newCourseDetail.save();
    res.status(201).send('Course details saved successfully');
  } catch (error) {
    res.status(500).send('Error saving course details');
  }
});

// Add this route to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Course Management Routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const newCourse = new Course({
      name,
      description
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: error.message });
  }
});

// app.patch('/api/courses/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description } = req.body;

//     if (!name && !description) {
//       return res.status(400).json({ message: 'At least one field to update is required' });
//     }

//     const updatedCourse = await Course.findByIdAndUpdate(
//       id,
//       {
//         ...(name && { name }),
//         ...(description && { description }),
//         updatedAt: Date.now()
//       },
//       { new: true }
//     );

//     if (!updatedCourse) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     res.json(updatedCourse);
//   } catch (error) {
//     console.error('Error updating course:', error);
//     res.status(400).json({ message: error.message });
//   }
// });

// ✅ Update Course
app.put('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, description, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course updated successfully', updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Internal server error while updating course' });
  }
});


// app.delete('/api/courses/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid course ID format' });
//     }

//     const deletedCourse = await Course.findByIdAndDelete(id);

//     if (!deletedCourse) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     res.json({ message: 'Course deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting course:', error);
//     res.status(500).json({ message: 'Internal server error while deleting course' });
//   }
// });

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
});




// Get available months for a course
app.get('/api/courses/:courseId/months', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { year } = req.query;
    console.log('Fetching available months:', { courseId, year });

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Filter batches by year if provided
    let batches = course.batches;
    if (year !== undefined) {
      batches = batches.filter(batch => batch.month && batch.year === parseInt(year));
    }

    // Get unique months
    const months = [...new Set(batches.map(batch => batch.month))].sort((a, b) => a - b);

    res.json(months);
  } catch (error) {
    console.error('Error fetching available months:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get monthly batches
app.get('/api/courses/:courseId/batches/:month', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const batches = course.batches.filter(batch => batch.month.toString() === req.params.month);
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/courses/:courseId/', async (req, res) => {
  try {
    console.log(req.params);

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/courses/:courseId', async (req, res) => {
  try {
    console.log("Update Request Params:", req.params);
    console.log("Update Request Body:", req.body);

    const { courseId } = req.params;
    const { name, description } = req.body;

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID format" });
    }

    // Find and update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { name, description, updatedAt: Date.now() }, // Update fields
      { new: true, runValidators: true } // Return updated course, validate inputs
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: error.message });
  }
});


// Get batch details
app.get('/api/courses/:courseId/batches/:batchId/details', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const batch = course.batches.id(req.params.batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.json(batch.courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update batch course
app.patch('/api/courses/:courseId/batches/:batchId/courses/:courseIndex', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const batch = course.batches.id(req.params.batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    const courseIndex = parseInt(req.params.courseIndex);
    if (courseIndex < 0 || courseIndex >= batch.courses.length) {
      return res.status(404).json({ message: 'Course not found in batch' });
    }

    Object.assign(batch.courses[courseIndex], req.body);
    await course.save();
    res.json(batch.courses[courseIndex]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete batch course
// app.delete('/api/courses/:courseId/batches/:batchId/courses/:courseId', async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.courseId);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     const batch = course.batches.id(req.params.batchId);
//     if (!batch) {
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     batch.courses = batch.courses.filter(c => c.id !== req.params.courseId);
//     await course.save();
//     res.status(204).send();
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

app.delete('/api/courses/:courseId/batches/:batchId', async (req, res) => {
  try {
    const { courseId, batchId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ message: 'Invalid course or batch ID format' });
    }

    // Find and update the course by pulling the batch from the array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { batches: { _id: batchId } } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: "Batch deleted successfully", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/extracourse/:extracourseId/:batchId', async (req, res) => {
  try {
    const { extracourseId, batchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(extracourseId) || !mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ message: 'Invalid course or batch ID format' });
    }

    // Find and update the course by pulling the batch from the array
    const updatedCourse = await Course.findByIdAndUpdate(
      extracourseId,
      { $pull: { batches: { _id: batchId } } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: "Batch deleted successfully", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});






// Add batch course
// app.post('/api/courses/:courseId/batches/:batchId/courses', async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.courseId);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     const batch = course.batches.id(req.params.batchId);
//     if (!batch) {
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     batch.courses.push(req.body);
//     await course.save();
//     res.status(201).json(batch.courses[batch.courses.length - 1]);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

app.post('/api/courses/:courseId/batches/:batchId/courses', async (req, res) => {
  try {
      const course = await Course.findById(req.params.courseId);
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      const batch = course.batches.id(req.params.batchId);
      if (!batch) {
          return res.status(404).json({ message: 'Batch not found' });
      }

      // Debugging Log
      console.log("Incoming Data:", req.body);

      if (!batch.courses) {
          batch.courses = [];
      }

      batch.courses.push(req.body);
      await course.save();
      
      res.status(201).json(batch.courses[batch.courses.length - 1]);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Get batches for a course
app.get('/api/courses/:courseId/batches', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { year, month } = req.query;
    console.log('Fetching batches:', { courseId, year, month });

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let batches = course.batches;

    // Filter by year if provided
    if (year !== undefined) {
      batches = batches.filter(batch => batch.year === parseInt(year));
    }

    // Filter by month if provided
    if (month !== undefined) {
      batches = batches.filter(batch => batch.month === parseInt(month));
    }

    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/courses/:courseId/batches', async (req, res) => {
  const { courseId } = req.params;
  const { year, month } = req.query;

  if (!courseId || !year || !month) {
    return res.status(400).json({ error: 'Course ID, year, and month are required' });
  }

  try {
    const batches = await getBatchesByCourseYearAndMonth(courseId, parseInt(year), parseInt(month));
    if (!batches || !Array.isArray(batches)) {
      return res.status(404).json({ error: 'No batches found' });
    }
    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ error: 'Failed to fetch batches', details: error.message });
  }
});



// Batch Management Routes
app.post('/api/batches', async (req, res) => {
  try {
    const { name, year, month, courseId } = req.body;
    console.log('Creating new batch:', { name, year, month, courseId });

    // Validate required fields
    if (!name || !year || !month || !courseId) {
      return res.status(400).json({
        message: 'Name, year, month, and courseId are required'
      });
    }

    // Validate year and month
    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 1) {
      return res.status(400).json({
        message: 'Invalid year'
      });
    }
    if (month < 1 || month > 12) {
      return res.status(400).json({
        message: 'Month must be between 1 and 12'
      });
    }

    app.get('/api/courses/:courseId/batches', async (req, res) => {
      const { courseId } = req.params;
      const { year, month } = req.query;

      if (!courseId || !year || !month) {
        return res.status(400).json({ error: 'Course ID, year, and month are required' });
      }

      try {
        const batches = await getBatchesByCourseYearAndMonth(courseId, parseInt(year), parseInt(month));
        if (!batches || !Array.isArray(batches)) {
          return res.status(404).json({ error: 'No batches found' });
        }
        res.json(batches);
      } catch (error) {
        console.error('Error fetching batches:', error);
        res.status(500).json({ error: 'Failed to fetch batches', details: error.message });
      }
    });


    // First check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if a batch with the same name already exists for this course
    const batchExists = course.batches.some(batch =>
      batch.name === name &&
      batch.year === year &&
      batch.month === month
    );

    if (batchExists) {
      return res.status(400).json({
        message: 'A batch with this name already exists for this course in the specified month and year'
      });
    }



    // Create the new batch
    const newBatch = {
      name,
      year,
      month,
      courseId,
      courses: [] // Initialize with empty courses array
    };

    // Add the batch to the course's batches array
    course.batches.push(newBatch);
    const updatedCourse = await course.save();

    // Get the newly created batch from the updated course
    const createdBatch = updatedCourse.batches[updatedCourse.batches.length - 1];

    // Return the newly created batch
    res.status(201).json(createdBatch);
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({
      message: error.message || 'Internal server error while creating batch'
    });
  }
});

// // Batch Salary Routes
// app.get('/api/batch-salary-data', async (req, res) => {
//   try {
//     const batchSalaryData = await BatchSalary.find().sort({ year: -1, month: -1 });
//     res.json(batchSalaryData);
//   } catch (error) {
//     console.error('Error fetching batch salary data:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

app.get('/api/batch-salary-data', async (req, res) => {
  try {
    const batchSalaryData = await Course.find().sort({ year: -1, month: -1 });

    // Transform data for the dashboard
    const formattedData = batchSalaryData.map(course =>
      course.batches.flatMap(batch =>
        batch.courses.map(lecture => ({
          courseName: course.name,
          batchName: batch.name,
          year: batch.year,
          month: batch.month,
          lectureName: lecture.lectureName,
          lectureCourse: lecture.name,
          salary: lecture.salary,
          paidAmount: lecture.paidAmount,
          paymentStatus: lecture.paymentStatus
        }))
      )
    ).flat(); // Flatten the array

    console.log(formattedData)

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching batch salary data:', error);
    res.status(500).json({ message: error.message });
  }
});


app.post('/api/batch-salary-data', async (req, res) => {
  try {
    const newBatchSalary = new BatchSalary(req.body);
    const savedBatchSalary = await newBatchSalary.save();
    res.status(201).json(savedBatchSalary);
  } catch (error) {
    console.error('Error creating batch salary:', error);
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/batch-salary-data/:id', async (req, res) => {
  try {
    const updatedBatchSalary = await BatchSalary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBatchSalary) {
      return res.status(404).json({ message: 'Batch salary data not found' });
    }
    res.json(updatedBatchSalary);
  } catch (error) {
    console.error('Error updating batch salary:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/batch-salary-data/:id', async (req, res) => {
  try {
    const deletedBatchSalary = await BatchSalary.findByIdAndDelete(req.params.id);
    if (!deletedBatchSalary) {
      return res.status(404).json({ message: 'Batch salary data not found' });
    }
    res.json({ message: 'Batch salary data deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch salary data:', error);
    res.status(500).json({ message: error.message });
  }
});

// Batch Details Routes
app.patch('/api/batch-details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to update batch detail with ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid batch detail ID format:', id);
      return res.status(400).json({ message: 'Invalid batch detail ID format' });
    }

    const updates = req.body;
    console.log('Update payload:', updates);

    const updatedBatchDetail = await BatchSalary.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedBatchDetail) {
      console.error('Batch detail not found with ID:', id);
      return res.status(404).json({ message: 'Batch detail not found' });
    }

    console.log('Successfully updated batch detail:', updatedBatchDetail);
    res.json(updatedBatchDetail);
  } catch (error) {
    console.error('Error updating batch detail:', error);
    res.status(500).json({ message: error.message || 'Internal server error while updating batch detail' });
  }
});

// Add this test route
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const dbName = mongoose.connection.name;
    const collections = await mongoose.connection.db.collections();
    console.log('Connected to database:', dbName);
    console.log('Available collections:', collections.map(c => c.collectionName));
    res.json({
      database: dbName,
      collections: collections.map(c => c.collectionName),
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/courses/:courseId/batches/:batchId', async (req, res) => {
  try {
    const { courseId, batchId } = req.params;
    const updates = req.body;

    console.log("🔄 Updating batch:", batchId, "for course:", courseId, "with updates:", updates);

    // ✅ Validate courseId & batchId as MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(batchId)) {
      console.error("❌ Invalid courseId or batchId:", courseId, batchId);
      return res.status(400).json({ message: 'Invalid courseId or batchId' });
    }

    // ✅ Find the course document
    const course = await Course.findById(courseId);
    if (!course) {
      console.error("❌ Course not found:", courseId);
      return res.status(404).json({ message: 'Course not found' });
    }

    // ✅ Find the batch within the course
    const batch = course.batches.id(batchId);
    if (!batch) {
      console.error("❌ Batch not found:", batchId);
      return res.status(404).json({ message: 'Batch not found' });
    }

    // ✅ Update the batch fields explicitly
    Object.keys(updates).forEach((key) => {
      batch[key] = updates[key];
    });

    // ✅ Mark batch as modified (ensures Mongoose detects changes)
    batch.markModified('name');
    batch.markModified('year');
    batch.markModified('month');

    // ✅ Save the updated course document
    await course.save();

    console.log("✅ Batch successfully updated:", batch);
    res.json({ message: "Batch updated successfully", batch });

  } catch (error) {
    console.error("❌ Error updating batch:", error);
    res.status(500).json({ message: "Failed to update batch", error: error.message });
  }
});

// extraaa course

app.get('/api/extracourse/:courseId/:batchId', async (req, res) => {
  try {
    const { courseId, batchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ message: 'Invalid course or batch ID format' });
    }

    // Fetch the extra course details
    const extraCourseDetails = await Course.findById(courseId).populate('batches');

    if (!extraCourseDetails) {
      return res.status(404).json({ message: 'Extra course not found' });
    }

    // Filter the batches to find the specific batch
    const batchDetails = extraCourseDetails.batches.find(batch => batch.id === batchId);

    if (!batchDetails) {
      return res.status(404).json({ message: 'Batch not found in extra course' });
    }

    res.status(200).json(batchDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/api/extracourse/:courseId/:batchId', async (req, res) => {
  try {
    const { courseId, batchId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ message: 'Invalid course or batch ID format' });
    }

    // Fetch the extra course details
    const extraCourseDetails = await Course.findById(courseId).populate('batches');

    if (!extraCourseDetails) {
      return res.status(404).json({ message: 'Extra course not found' });
    }

    // Filter the batches to find the specific batch
    const batchDetails = extraCourseDetails.batches.find(batch => batch._id.toString() === batchId);

    if (!batchDetails) {
      return res.status(404).json({ message: 'Batch not found in extra course' });
    }

    res.status(200).json(batchDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.delete('/api/extracourse/:courseId/:batchId', async (req, res) => {
  const { courseId, batchId } = req.params;
  try {
    // Logic to delete the course from the batch in your database
    // For example, using Mongoose:
    await Course.findByIdAndDelete(courseId); // Adjust as necessary
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get('/api/extracourse/:courseId/:batchId', async (req, res) => {
  try {
    const { courseId, batchId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ message: 'Invalid course or batch ID format' });
    }

    // Fetch the course and populate batches
    const course = await Course.findById(courseId).populate('batches');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the specific batch
    const batch = course.batches.find(batch => batch._id.toString() === batchId);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Extract only the `_id` values from the courses
    const courseIds = batch.courses.map(course => course._id);

    res.status(200).json({ courseIds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
