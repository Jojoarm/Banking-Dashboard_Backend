import mongoose from 'mongoose';
import { Bank } from '../../types';

const accountNumberGenerator = () => {
  let acctNumber = [];
  for (let i = 0; i < 10; i++) {
    acctNumber.push(Math.floor(Math.random() * 10));
  }

  return acctNumber.toString().replace(/\,/g, '');
};

const savingsAccountSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true, default: 'Savings Account' },
  accountNo: { type: String, unique: true, default: '111 111 1111' },
  balance: { type: Number, required: true, default: 0 },
  transactionHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transactions',
  },
  cards: { type: Object, default: {} },
});

const checkingAccountSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, default: 'Checking Account' },
  accountNo: { type: String, unique: true, default: '000 000 0000' },
  balance: { type: Number, default: 0 },
  transactionHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transactions',
  },
  cards: { type: Object, default: {} },
});

//   accountNo: { type: String, default: accountNumberGenerator() },

const bankSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  accounts: [savingsAccountSchema, checkingAccountSchema],
  balance: { type: Number, default: 0 },
  //   accountId: { type: String, required: true },
  //   bankId: { type: String, required: true },
  //   accessToken: { type: String, required: true },
  //   fundingSourceUrl: { type: String, required: true },
  //   sharableId: { type: String },
});

const Bank = mongoose.model<Bank>('Bank', bankSchema);

export default Bank;
