import mongoose, { Document, Schema } from 'mongoose';
import { date } from 'zod';

export interface IStudent45 extends Document {
  studentId: string;
  studentName: string;
  courseId?: string;
  progress?: string;
  paid?: string;
  completionDate?: string;
  status?: string;  // "enrolled", "completed", "dropped"
  enrollmentDate?: string;    
  lecturer?:String,
  grade?: string;
  feedback?: string;
  transferBy?:string;
  transaction_id?:string;
  transaction_date?:Date;

  completionPercentage?: string;
  lastAccessed?: string;
  // receipt?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const studentSchema: Schema = new Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  courseId: { type: String },
  progress: { type: String },
  paid: { type: String, default: 'false' },
  completionDate: { type: String },
  status: { type: String },
  transferBy: { type: String },
  transaction_id: { type: String },
  transaction_date:{ type: Date },
  lecturer: { type: String },

  enrollmentDate: { type: String },
  grade: { type: String },
  feedback: { type: String },
  completionPercentage: { type: String },
  lastAccessed: { type: String },
  // receipt: { type: String }
}, { timestamps: true });

export default mongoose.model<IStudent45>('Student', studentSchema);
