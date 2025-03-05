import mongoose from 'mongoose';
import { BankAccount } from '../../types';

const checkingAccountSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, default: 'Checking Account' },
  accountNo: { type: String, default: '000 000 0000' },
  balance: { type: Number, default: 0 },
  transactionHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transactions',
  },
  cards: { type: Object, default: {} },
});

const CheckingAccount = mongoose.model<BankAccount>(
  'CheckingAccount',
  checkingAccountSchema
);

export default CheckingAccount;
