import mongoose from 'mongoose';
import { BankAccount } from '../../types';

const savingsAccountSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, default: 'Savings Account' },
  accountNo: { type: String, default: '111 111 1111' },
  balance: { type: Number, default: 0 },
  transactionHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transactions',
  },
  cards: { type: Object, default: {} },
});

const SavingsAccount = mongoose.model<BankAccount>(
  'SavingsAccount',
  savingsAccountSchema
);

export default SavingsAccount;
