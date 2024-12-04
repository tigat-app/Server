import express from 'express';
import {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  getCommunitiesByCourseId
} from '../controllers/communityController'; // Adjust the import path as necessary

const router = express.Router();

router.post('/communities', createCommunity);
router.get('/communities', getAllCommunities);
router.get('/communities/:id', getCommunityById);
router.put('/communities/:id', updateCommunity);
router.delete('/communities/:id', deleteCommunity);
router.get('/communities/course/:courseId', getCommunitiesByCourseId); // New route

export default router;
