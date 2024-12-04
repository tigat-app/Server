import mongoose, { Schema, Document } from 'mongoose';

interface ISubSubCategory extends Document {
  name: string;
  subCategory: string;
}

const subSubCategorySchema: Schema<ISubSubCategory> = new Schema<ISubSubCategory>({
  name: { type: String, required: true },
  subCategory: { type: String, required: true },
});

const SubSubCategory = mongoose.model<ISubSubCategory>('SubSubCategory', subSubCategorySchema);

export default SubSubCategory;