import { Request, Response } from 'express';
import Student, { IStudent45 } from '../models/studenCourse';
import path from 'path';
import multer from 'multer';
import mongoose from 'mongoose';

const BASE_URL = 'http://153.92.208.33:7070';

// Create Student
// Get All Students



// Create Student
export const createStudent = async (req: Request, res: Response): Promise<void> => {
  const { studentId,lecturer, studentName,transaction_date,transaction_id,transferBy, courseId, progress, paid, completionDate, status, enrollmentDate, grade, feedback, completionPercentage, lastAccessed } = req.body;
  // const receipt = req.file?.filename; // Use filename instead of path

  try {
    const newStudent = new Student({
      studentId,
      studentName,
      courseId,
      progress,
      paid,
      completionDate,
      status,
      enrollmentDate,
      grade,
      feedback,
      lecturer,
      completionPercentage,
      lastAccessed,
      transaction_date,
      transaction_id,
      transferBy 
      // receipt: receipt ? path.join('uploads', receipt) : undefined
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const subCategories = await Student.find();
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get Student By ID
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id) as IStudent45;
    if (!student) {
      res.status(404).send({ message: 'Student not found' });
      return;
    }
    res.json(student);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Update Student
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { studentId, studentName, courseId, progress, paid, completionDate, status, enrollmentDate, grade, feedback, completionPercentage, lastAccessed } = req.body;
  
  try {
    const student = await Student.findById(id) as IStudent45;

    if (!student) {
      res.status(404).send({ message: 'Student not found' });
      return;
    }

    student.studentId = studentId || student.studentId;
    student.studentName = studentName || student.studentName;
    student.courseId = courseId || student.courseId;
    student.progress = progress || student.progress;
    student.paid = paid || student.paid;
    student.completionDate = completionDate || student.completionDate;
    student.status = status || student.status;
    student.enrollmentDate = enrollmentDate || student.enrollmentDate;
    student.lecturer = enrollmentDate || student.lecturer;

    student.grade = grade || student.grade;
    student.feedback = feedback || student.feedback;
    student.completionPercentage = completionPercentage || student.completionPercentage;
    student.lastAccessed = lastAccessed || student.lastAccessed;
    
    await student.save();
    res.json(student);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Delete Student
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      res.status(404).send({ message: 'Student not found' });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};


export const markCourseAsCompleted = async (req: Request, res: Response) => {
  const { studentId, courseId } = req.body;

  try {
    const student = await Student.findOne({ studentId, courseId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found for the specified course.' });
    }

    // Mark the course as completed
    student.status = 'completed';
    student.completionDate = new Date().toISOString();

    await student.save();

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};


export const updateCourseProgress = async (req: Request, res: Response) => {
  const { studentId, courseId, progress } = req.body;

  try {
    const student = await Student.findOne({ studentId, courseId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found for the specified course.' });
    }

    student.progress = progress || student.progress;

    await student.save();

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};


export const updatePercent = async (req: Request, res: Response) => {
  const { studentId, courseId, percent } = req.body;

  try {
    const student = await Student.findOne({ studentId, courseId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found for the specified course.' });
    }

    student.completionPercentage = percent || student.completionPercentage;

    await student.save();

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
export const addCourseFeedback = async (req: Request, res: Response) => {
  const { studentId, courseId, feedback } = req.body;

  try {
    // Find the student by both studentId and courseId
    const student = await Student.findOne({ studentId, courseId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found for the specified course.' });
    }

    // Add course feedback
    student.feedback = feedback || student.feedback;

    await student.save();

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
export const updateCoursePaidStatus = async (req: Request, res: Response): Promise<void> => {
  const { studentId, courseId, paid } = req.body;

  try {
    // Fetch the student record using studentId and courseId
    const student = await Student.findOne({ studentId, courseId });

    if (!student) {
      res.status(404).send({ message: 'Student not found' });
      return;
    }

    // Update the paid status
    student.paid = paid !== undefined ? paid : student.paid;
    await student.save();

    res.send({ message: 'Paid status updated successfully' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Get Total Number of Students Per Month
export const getTotalStudentsPerMonth = async (req: Request, res: Response) => {


  try {
    const result = await Student.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalStudents: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    res.status(200).json(result);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export const getStudentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the total number of students
    const totalStudents = await Student.countDocuments();

    // Get the number of students enrolled each month
    const monthlyEnrollments = await Student.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Format the monthly enrollment data
    const formattedMonthlyEnrollments = monthlyEnrollments.map((entry) => ({
      year: entry._id.year,
      month: entry._id.month,
      count: entry.count
    }));

    res.status(200).json({
      totalStudents,
      monthlyEnrollments: formattedMonthlyEnrollments
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};


export const getStudentStatsByLecture = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lecturer } = req.params;

    if (!lecturer) {
      res.status(400).json({ message: "Lecture ID is required" });
      return;
    }

    // Get the total number of students for the specific lectureId
    const totalStudents = await Student.countDocuments({ lecturer });
    if (!totalStudents) {
      res.status(400).json({ message: "Lecture ID is required" });
      return;
    }


    // Get the number of students enrolled each month for the specific lectureId
    const monthlyEnrollments = await Student.aggregate([
      {
        $match: { lecturer } // Filter by lectureId
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Format the monthly enrollment data
    const formattedMonthlyEnrollments = monthlyEnrollments.map((entry) => ({
      year: entry._id.year,
      month: entry._id.month,
      count: entry.count
    }));

    res.status(200).json({
      totalStudents,
      monthlyEnrollments: formattedMonthlyEnrollments
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};