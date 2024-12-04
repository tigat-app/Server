import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updateCourseProgress,
  markCourseAsCompleted,
  addCourseFeedback,
  updateCoursePaidStatus,
  getStudentStatsByLecture,
  updatePercent,
  getStudentStats,
} from '../controllers/studenCourse';
import multer from 'multer';
import path from 'path';

// Configure multer for file upload

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Create a new student with mandatory receipt upload
router.post('/students', upload.single('receipt'), createStudent);

router.get('/students', getAllStudents);

router.get('/students/:id', getStudentById);

router.put('/students/:id', updateStudent);

router.delete('/students/:id', deleteStudent);

router.post('/students/updatePaidStatus', updateCoursePaidStatus);
router.get('/stats/:lecturer', getStudentStatsByLecture);

router.get('/getStudentStats', getStudentStats );
// router.get('/students/total', getTotalStudents  );

router.post('/students/updatePercent', updatePercent  );


router.post('/students/updateProgress', updateCourseProgress);

router.post('/students/markCompleted', markCourseAsCompleted);

router.put('/students/addFeedback', addCourseFeedback);

export default router;
