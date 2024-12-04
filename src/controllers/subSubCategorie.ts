import { Request, Response } from 'express';
import SubSubCategory from '../models/subSubCategorie';

// Create a new sub-subcategory
export const createSubSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, subCategory } = req.body;
    if (!name ) {
      return res.status(400).json({ error: 'Name and subCategory are required' });
    }

    const newSubSubCategory = new SubSubCategory({ name, subCategory });
    await newSubSubCategory.save();
    res.status(201).json(newSubSubCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all sub-subcategories
export const getSubSubCategories = async (req: Request, res: Response) => {
  try {
    const subSubCategories = await SubSubCategory.find();
    res.status(200).json(subSubCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single sub-subcategory by ID
export const getSubSubCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subSubCategory = await SubSubCategory.findById(id);

    if (!subSubCategory) {
      return res.status(404).json({ error: 'SubSubCategory not found' });
    }

    res.status(200).json(subSubCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a sub-subcategory by ID
export const updateSubSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, subCategory } = req.body;

    if (!name || !subCategory) {
      return res.status(400).json({ error: 'Name and subCategory are required' });
    }

    const updatedSubSubCategory = await SubSubCategory.findByIdAndUpdate(
      id,
      { name, subCategory },
      { new: true, runValidators: true }
    );

    if (!updatedSubSubCategory) {
      return res.status(404).json({ error: 'SubSubCategory not found' });
    }

    res.status(200).json(updatedSubSubCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a sub-subcategory by ID
export const deleteSubSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSubSubCategory = await SubSubCategory.findByIdAndDelete(id);

    if (!deletedSubSubCategory) {
      return res.status(404).json({ error: 'SubSubCategory not found' });
    }

    res.status(200).json({ message: 'SubSubCategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
