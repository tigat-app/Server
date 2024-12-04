import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  courseCover: string;
  title: string;
  description: string;
  lecturer: string;
  durations: number;
  level: string;
  category: string;
  totalLesson: number;
  subcategory: string;
  subsubcategory: string;
  isDeleted: boolean;
  lessons: Array<{
    lessonTitle: string;
    overview: string;
    files: string[];
  }>;
  features: Array<{
    title: string;
    feature: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const lessonSchema: Schema = new Schema({
  lessonTitle: { type: String, required: true },
  overview: { type: String, required: true },
  files: [{ type: String }],
});

const featureSchema: Schema = new Schema({
  title: { type: String, required: true },
  feature: { type: String, required: true },
});

const courseSchema: Schema = new Schema({
  courseCover: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  totalLesson: { type: Number, default: 0 },
  lecturer: { type: String, required: true },
  durations: { type: Number, required: true },
  level: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  subsubcategory: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  lessons: [lessonSchema],
  features: [featureSchema],
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', courseSchema);
