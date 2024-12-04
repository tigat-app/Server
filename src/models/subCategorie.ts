import mongoose, { Schema, Document } from 'mongoose';

interface ISubCategory extends Document {
  name: string;
  category: string;
}
////
const subCategorySchema: Schema<ISubCategory> = new Schema<ISubCategory>({
  name: { type: String, required: true },
  category: { type: String, required: true },
});

const SubCategory = mongoose.model<ISubCategory>('SubCategory', subCategorySchema);

export default SubCategory;