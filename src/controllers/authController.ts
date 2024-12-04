import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import  Course, { ICourse } from '../models/Course'

import { userSchema } from '../validation/userSchema.zod';
import { AuthenticatedRequest } from '../type';
import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


export const register = async (req: Request, res: Response) => {
  const { firstName, userType, lastName, middleName, email, password, phone } = req.body;
  console.log(req.body);

  try {
    // Check if user already exists
    let user = await User.findOne({ phone });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Handle profile picture upload
    const profilePic = req.file ? req.file.path : undefined;

    console.log(profilePic);

    // Create new user
    user = new User({ firstName, userType, lastName, middleName, email, password, phone, profilePic } as IUser);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to the database
    await user.save();

    // Generate JWT token
    const id = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      id,
      process.env.JWT_SECRET!,
      { expiresIn: '24h' },
      (err: Error | null, token?: string) => {
        if (err) {
          console.error('JWT signing error:', err.message);
          return res.status(500).json({ message: 'Error generating token' });
        }
        if (!token) {
          return res.status(500).json({ message: 'Failed to generate token' });
        }
        res.json({ message: 'User registered successfully', token });
      }
    );
  } catch (error: any) {
    console.error('Server error:', error.message);
    res.status(500).send('Server error');
  }
};

export { upload };


export const getUserInfo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileName = user.profilePic; // Adjust property name as necessary

    const fileUrl = fileName ? `${protocol}://${host}/uploads/${path.basename(fileName)}` : '';

    res.json({
      ...user.toObject(),
      filePath: fileUrl,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const login = async (req: Request, res: Response) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: '24hr' },
      (err: Error | null, token?: string) => {
        if (err) throw err;
        if (!token) throw new Error('Failed to generate token');

        const host = req.get('host');
        const protocol = req.protocol;
        const fileName = user.profilePic; // Adjust property name as necessary

        const fileUrl = fileName ? `${protocol}://${host}/uploads/${path.basename(fileName)}` : '';

        res.json({
          _id: user.id,

          token,
          userType: user.userType,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          email: user.email,
          phone: user.phone,
          filePath: fileUrl,
        });
      }
    );
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();

    const host = req.get('host');
    const protocol = req.protocol;

    const usersWithProfilePicUrl = users.map((user) => {
      const fileName = user.profilePic; // Adjust property name as necessary
      if (fileName) {
        const fileUrl = `${protocol}://${host}/uploads/${path.basename(fileName)}`;
        return {
          ...user.toObject(),
          filePath: fileUrl,
        };
      } else {
        return {
          ...user.toObject(),
          filePath: '',
        };
      }
    });

    res.json(usersWithProfilePicUrl);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};


export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error(error.message); 
    res.status(500).send('Server error');
  }
};



export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.userType === 'Lecture') {
      const courses = await Course.find({ lectureId: req.params.id });
      if (courses.length > 0) {
        await Course.deleteMany({ lecturer: req.params.id });
      }
    }

    user.isDeleted = true;
    await user.save();

    res.json({ message: 'User marked as deleted successfully' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const deleteCourseByLectureId = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    const course = await Course.find({lectureId:req.params.id});
    const courseDelete = await Course.findByIdAndDelete(course);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isDeleted = true;
    await user.save();
    res.json({ message: 'User marked as deleted successfully' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const deleteMultipleUsers = async (req: Request, res: Response) => {
  const { userIds } = req.body;

  if (!userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ message: 'Invalid user IDs' });
  }

  try {
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { isDeleted: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'No users found or already deleted' });
    }

    res.json({ message: 'Users marked as deleted successfully', count: result.modifiedCount });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const filterUsersByType = async (req: Request, res: Response) => {
  const { userType } = req.query;

  if (!userType) {
    return res.status(400).json({ message: 'User type is required' });
  }

  try {
    const users = await User.find({ userType, isDeleted: false }).select('-password');

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found for the specified type' });
    }

    res.json(users);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const updateUserById = async (req: Request, res: Response) => {
  const { firstName, lastName, middleName, email, password, phone } = req.body;
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.middleName = middleName || user.middleName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (req.file) {
      user.profilePic = req.file.path;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ message: 'User updated successfully' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

