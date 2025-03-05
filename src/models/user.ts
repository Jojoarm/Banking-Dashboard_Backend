import mongoose from 'mongoose';
import { UserType } from '../../types';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // bank: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank' },
  accounts: [],
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address1: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  ssn: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const User = mongoose.model<UserType>('User', userSchema);

export default User;
