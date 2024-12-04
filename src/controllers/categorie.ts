import { Request, Response } from 'express';
import Category from '../models/Categorie'
import SubCategorie from '../models/subCategorie'
import subsubCategory from '../models/subSubCategorie'



// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a category by ID
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSubCategoryByName = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    const CategoryId = await SubCategorie.find({category:category});

    if (!CategoryId) {
      return res.status(404).json({ error: 'Sub Category  not found' });
    }

    res.status(200).json(CategoryId);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a category by ID

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Delete the category
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const deletedSubcategories = await SubCategorie.find({ category: id });
    if (deletedSubcategories.length > 0) {
      await SubCategorie.deleteMany({ category: id });
      
      const subCategoryIds = deletedSubcategories.map(sub => sub._id);
      await subsubCategory.deleteMany({ subCategory: { $in: subCategoryIds } });
    }

    res.status(200).json({ message: 'Category and related subcategories/sub-subcategories deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
