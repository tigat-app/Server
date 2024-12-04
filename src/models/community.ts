import mongoose, { Document, Schema } from 'mongoose';

export interface Community extends Document {
  lectureId: string;
  lectureName: string;
  url: string,
  groupName:String

}

const communitySchema: Schema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  lectureId: { type: String, required: true },
  lectureName: { type: String, required: true },
  url: { type: String, required: true },

  groupName: { type: String, required: true },

}, { timestamps: true });

export default mongoose.model<Community>('Community', communitySchema);
