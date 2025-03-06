import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'completed'],
    default: 'pending'
  }
});

const batchSalarySchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  batchName: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  lecturerName: { type: String, required: true },
  lecturerCourseName: { type: String, required: true },
  salary: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid'], required: true }
});

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courses: [{
    name: { type: String, required: true },
    lectureName: { type: String, required: true },
    workStatus: { 
      type: String, 
      enum: ['Not Started', 'In Progress', 'Incomplete', 'Complete'],
      default: 'Not Started'
    },
    salary: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    paymentStatus: { 
      type: String, 
      enum: ['Pending', 'Done'],
      default: 'Pending'
    },
    paymentScreenshot: { type: String }
  }]
});

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  batches: [{
    name: { type: String, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    courses: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      name: { type: String, required: true },
      lectureName: { type: String, required: true },
      workStatus: { 
        type: String, 
        enum: ['Not Started', 'In Progress', 'Incomplete', 'Complete'],
        default: 'Not Started'
      },
      salary: { type: Number, required: true },
      paidAmount: { type: Number, default: 0 },
      paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Done'],
        default: 'Pending'
      },
      paymentScreenshot: { type: String }
    }]
  }]
}, {
  timestamps: true
});

// Update timestamps on save
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Payroll = mongoose.model('Payroll', payrollSchema);
const BatchSalary = mongoose.model('BatchSalary', batchSalarySchema);
const Course = mongoose.model('Course', courseSchema);

export { Payroll, BatchSalary, Course };


// import mongoose from "mongoose"

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Course || mongoose.model("Course", CourseSchema)

export async function deleteCourse(id) {
  if (!id) {
    console.error("Error: Missing course ID")
    return null
  }

  try {
    const response = await fetch(`/api/courses?id=${id}`, { method: "DELETE" }) // Fix URL
    if (!response.ok) throw new Error("Failed to delete course")
    return await response.json()
  } catch (error) {
    console.error("Error deleting course:", error)
    return null
  }
}


