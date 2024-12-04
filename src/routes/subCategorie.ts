import express from 'express';
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryByName,
  
} from '../controllers/subCategorie';

const router = express.Router();

router.post('/subcategories', createSubCategory);
router.get('/subcategories', getSubCategories);
router.get('/subcategories/:id', getSubCategoryById);
router.put('/subcategories/:id', updateSubCategory);
router.delete('/subcategories/:id', deleteSubCategory);

router.post('/subcategories', createSubCategory);


router.post('/findByName', getSubCategoryByName);



export default router;
