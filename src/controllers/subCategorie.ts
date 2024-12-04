import { Request, Response } from 'express';
import SubCategory from '../models/subCategorie';
import SubSubCategory from '../models/subSubCategorie';



export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const newSubCategory = new SubCategory({ name, category });
    await newSubCategory.save();
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all subcategories
export const getSubCategories = async (req: Request, res: Response) => {
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single subcategory by ID
export const getSubCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.status(200).json(subCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSubCategoryByName = async (req: Request, res: Response) => {
  try {
    const { subCategory } = req.body;
    const CategoryId = await SubSubCategory.find({subCategory:subCategory});

    if (!CategoryId) {
      return res.status(404).json({ error: 'category not found' });
    }

    res.status(200).json(CategoryId);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Update a subcategory by ID
export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    if (!name ) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      { name, category },
      { new: true, runValidators: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.status(200).json(updatedSubCategory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a subcategory by ID
export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
