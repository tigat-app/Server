import { Request, Response } from 'express';
import  Course, { ICourse } from '../models/Course'
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import Lesson from '../models/lesson.model';
import lessonModel from '../models/lesson.model';
import mime from 'mime';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

interface MulterRequest extends Request {
  files: { [fieldname: string]: Express.Multer.File[] } | undefined;
}

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      lecturer,
      durations,
      level,
      category,
      subcategory,
      subsubcategory,
      totalLesson,
      lessons,
      features, // Add this line to destructure features from req.body
    } = req.body;
    console.log(req.body);

    const multerReq = req as MulterRequest;

    const courseCover = multerReq.files?.['courseCover'] ? multerReq.files['courseCover'][0].path : '';

    const newCourse = new Course({
      courseCover,
      title,
      description,
      lecturer,
      durations,
      level,
      category,
      subcategory,
      subsubcategory,
      totalLesson,
      features: features ? JSON.parse(features) : [], 
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      message: 'Course and lessons created successfully',
      course: savedCourse,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export const uploadFiles = upload.fields([
  { name: 'courseCover', maxCount: 1 },
  ...Array.from({ length: 100 }, (_, i) => ({ name: `lessonFiles${i}`, maxCount: 10 }))
]);




export const createLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, lessonTitle, overview } = req.body;
    const multerReq = req as MulterRequest;
    console.log(req.body);

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Handle file uploads
    const files = multerReq.files?.['lessonFiles'] ? multerReq.files['lessonFiles'].map((file: any) => file.path) : [];

    // Create a new lesson
    const newLesson = new Lesson({
      courseId,
      lessonTitle,
      overview,
      files,
    });

    // Save the lesson to the database
    const savedLesson = await newLesson.save();

    // Increment the totalLesson field in the course
    course.totalLesson = (course.totalLesson || 0) + 1;
    await course.save();

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: savedLesson,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};


// Multer file upload configuration for lesson creation
export const uploadLessonFiles = upload.fields([
  { name: 'lessonFiles', maxCount: 10 }
]);






export const getFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const lessonId = req.params.lessonId;
    const fileName = req.params.filename;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    const filePath = lesson.files.find((file) => path.basename(file) === fileName);

    if (!filePath) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    console.log('Lesson ID:', lessonId);
    console.log('Requested Filename:', fileName);
    console.log('Resolved File Path:', filePath);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.sendFile(path.resolve(filePath));
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};



export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find();

    const host = req.get('host');
    const protocol = req.protocol;

    const coursesWithFilePaths = courses.map((course) => {
      const fileName = course.courseCover; // Adjust property name as necessary

      // Clean the file path to remove redundant 'uploads' directories and construct the URL
      const fileUrl = fileName ? `${protocol}://${host}/uploads/${path.basename(fileName)}` : '';

      return {
        ...course.toObject(),
        filePath: fileUrl
      };
    });

    res.json(coursesWithFilePaths);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};
export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const lessonId = req.params.lessonId;
    const fileName = req.params.filename;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    const filePath = lesson.files.find((file) => path.basename(file) === fileName);

    if (!filePath) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.download(path.resolve(filePath), fileName, (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
      }
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Route to stream video files


export const streamVideo = async (req: Request, res: Response) => {
  try {
    const { lessonId, fileIndex } = req.params;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson || !lesson.files[fileIndex as any]) {
      return res.status(404).send('Video not found');
    }

    const videoPath = path.resolve(lesson.files[fileIndex as any]);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};


 
  // Get all courses

  
  // Get a course by ID
  export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const course = await Course.findById(req.params.id);
      console.log(req.params.id);
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    }  catch (error: any) {
        console.error(error.message);
        res.status(500).send({message:error.message});
      }
  };

  export const getCourseByLectureId = async (req: Request, res: Response): Promise<void> => {
    try {
      // const course = await Course.find(req.params.id);
      const course = await Course.find({lecturer:req.params.id});

      console.log(req.params.id);
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    }  catch (error: any) {
        console.error(error.message);
        res.status(500).send({message:error.message});
      }
  };
  

  export const getLessonByCourseId = async (req: Request, res: Response): Promise<void> => {
    try {
      const lessons = await lessonModel.find({ courseId: req.params.id });
  
      if (lessons.length > 0) {
        res.status(200).json(lessons);
      } else {
        res.status(404).json({ message: 'No lessons found for this course' });
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send({ message: error.message });
    }
  };
  
  
  // Update a course by ID
  export const updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const course = await Course.findByIdAndUpdate(req.params.id, req.body,);
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    }  catch (error: any) {
        console.error(error.message);
        res.status(500).send({message:error.message});
      }
  };
  
  // Delete a course by ID
  export const deleteCourse = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      if (course.isDeleted) {
        return res.status(400).json({ message: 'Course is already deleted' });
      }
  
      // Soft-delete the course by setting the isDeleted flag
      course.isDeleted = true;
      await course.save();
  
      return res.status(200).json({ message: 'Course marked as deleted successfully', course });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  };



  export const BackToActive = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      if (!course.isDeleted) {
        return res.status(400).json({ message: 'Course is already active' });
      }
  
      course.isDeleted = false;
      await course.save();
  
      return res.status(200).json({ message: 'Course activate successfully', course });
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  };

  export const deleteMultipleCourse = async (req: Request, res: Response) => {
    const { courseIds } = req.body;
  
    if (!courseIds || !Array.isArray(courseIds)) {
      return res.status(400).json({ message: 'Invalid Course  IDs' });
    }
  
    try {
      const result = await Course.updateMany(
        { _id: { $in: courseIds } },
        { $set: { isDeleted: true } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'No Course found or already deleted' });
      }
  
      res.json({ message: 'Course marked as deleted successfully', count: result.modifiedCount });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  };

  export const searchCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    const courses = await Course.find({
      $or: [
        { title: new RegExp(query as string, 'i') },
        { description: new RegExp(query as string, 'i') },
        { lecturer: new RegExp(query as string, 'i') },
      ]
    });
    res.status(200).json(courses);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};