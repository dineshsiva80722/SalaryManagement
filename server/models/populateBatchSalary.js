const mongoose = require('mongoose');
const { Course, BatchSalary } = require('../models/payroll');
const { connectDB } = require('../db');

async function populateBatchSalaryData() {
  try {
    await connectDB();
    
    // Get all courses with their batches
    const courses = await Course.find().populate('batches');
    
    for (const course of courses) {
      for (const batch of course.batches) {
        for (const batchCourse of batch.courses) {
          const batchSalaryData = new BatchSalary({
            courseName: course.name,
            batchName: batch.name,
            year: batch.year,
            month: batch.month,
            lecturerName: batchCourse.lectureName,
            lecturerCourseName: batchCourse.name,
            salary: batchCourse.salary,
            paidAmount: batchCourse.paidAmount,
            status: batchCourse.paymentStatus === 'Done' ? 'Paid' : 'Pending'
          });
          
          await batchSalaryData.save();
        }
      }
    }
    
    console.log('Batch salary data populated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error populating batch salary data:', error);
    process.exit(1);
  }
}

populateBatchSalaryData();