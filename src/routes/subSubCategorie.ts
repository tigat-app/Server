import express from 'express';
import {
  createSubSubCategory,
  getSubSubCategories,
  getSubSubCategoryById,
  updateSubSubCategory,
  deleteSubSubCategory,
} from '../controllers/subSubCategorie';

const router = express.Router();

router.post('/subsubcategories', createSubSubCategory);
router.get('/subsubcategories', getSubSubCategories);
router.get('/subsubcategories/:id', getSubSubCategoryById);
router.put('/subsubcategories/:id', updateSubSubCategory);
router.delete('/subsubcategories/:id', deleteSubSubCategory);

export default router;
