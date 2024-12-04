import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userType?: string;
  profilePic?: string;


}

const userSchema: Schema = new Schema({
  
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, },
  password: { type: String, required: true },
  phone: { type: String, unique: true , match: /^\+[1-9]\d{1,14}$/ },
  userType: { type: String, required: true },
  profilePic: { type: String },


  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
