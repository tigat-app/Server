import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  courseId: mongoose.Types.ObjectId;
  lessonTitle: string;
  overview: string;
  files: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const lessonSchema: Schema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonTitle: { type: String, required: true },
  overview: { type: String, required: true },
  files: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<ILesson>('Lesson', lessonSchema);
