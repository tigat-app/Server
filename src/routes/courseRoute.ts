import { Router } from 'express';
import { createCourse,uploadFiles,uploadLessonFiles,BackToActive, createLesson,getCourseByLectureId,deleteMultipleCourse, getLessonByCourseId, getFile,downloadFile,streamVideo, getCourses,searchCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/courseController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

//
router.get('/getCourses', getCourses);
router.post('/courses',  uploadFiles, createCourse);
router.get('/video/:lessonId/:fileIndex', streamVideo);

router.get('/stream/:filename', streamVideo); // Route to stream video
router.get('/download/:filename', getFile); // Route to download file
router.get('/get/:lessonId/files/:filename', getFile);
router.get('/download/:lessonId/files/:filename', downloadFile);


router.put('/deleteMultipleCourse', deleteMultipleCourse);




router.get('/getLessonByCourseId/:id', getLessonByCourseId);

router.get('/getCourseById/:id', getCourseById);
router.get('/getCourseByLectureId/:id', getCourseByLectureId);
router.post('/course/:courseId/lessons', uploadLessonFiles, createLesson);

router.put('/updateCourse/:id', updateCourse);
router.put('/deleteCourse/:id', deleteCourse);
router.put('/active/:id', BackToActive);

router.get('/search', searchCourses);
router.post('/postCourses78', upload.single('courseCover'), createCourse);







export default router;
