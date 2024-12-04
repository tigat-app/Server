import { Router } from 'express';
import { register,upload, login,getAllUsers, deleteMultipleUsers,getUserInfo,filterUsersByType, deleteUserById,getUserById,updateUserById } from '../controllers/authController';
import authMiddleware from '../middlware/authMiddleware'


const router = Router();

router.post('/register', upload.single('profilePic'), register);
router.post('/login', login);
router.get('/allusers', getAllUsers);
router.get('/getUserInfo',authMiddleware, getUserInfo);
router.get('/filter', filterUsersByType);
router.put('/updateUserById/:id', upload.single('profilePic'), updateUserById);


router.get('/getUserById/:id', getUserById);
//
router.delete('/deleteUserById/:id', deleteUserById);
router.delete('/deleteMultipleUsers', deleteMultipleUsers);





export default router;
