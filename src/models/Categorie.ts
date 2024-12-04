import mongoose, { Schema, Document } from 'mongoose';

interface ICategory extends Document {
  name: string;
}

const categorySchema: Schema<ICategory> = new Schema<ICategory>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>('category', categorySchema);

export default Category;