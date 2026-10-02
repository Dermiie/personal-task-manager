import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, "Invalid Email"],
  },
  password: {
    type: String,
    required: false,
    minLength: 8,
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
