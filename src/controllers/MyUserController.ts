import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import uploadImage from '../middlewares/uploadImage';
import Bank from '../models/bank';
import CheckingAccount from '../models/checkingAccount';
import SavingsAccount from '../models/savingsAccount';
import accountNumberGenerator from '../utils/accountNumberGenerator';

const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      address1,
      city,
      state,
      postalCode,
      dateOfBirth,
      ssn,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).send({ message: 'User already exist!' });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //for image upload
    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      address1,
      city,
      state,
      postalCode,
      dateOfBirth,
      ssn,
    });

    newUser.imageUrl = imageUrl;

    // Generate checking account
    let checkingAccountNumber = accountNumberGenerator();

    const existingCheckingAccountNo = await CheckingAccount.findOne({
      checkingAccountNumber,
    });

    if (existingCheckingAccountNo) {
      checkingAccountNumber = accountNumberGenerator();
    }

    const newCheckingAccount = new CheckingAccount({
      accountNo: checkingAccountNumber,
      user: newUser._id,
    });
    await newCheckingAccount.save();

    newUser.accounts.push(newCheckingAccount);

    // Generate saving account
    let savingsAccountNumber = accountNumberGenerator();
    const existingSavingsAccountNo = await SavingsAccount.findOne({
      savingsAccountNumber,
    });

    if (existingSavingsAccountNo) {
      savingsAccountNumber = accountNumberGenerator();
    }

    const newSavingsAccount = new SavingsAccount({
      accountNo: savingsAccountNumber,
      user: newUser._id,
    });
    await newSavingsAccount.save();

    newUser.accounts.push(newSavingsAccount);

    await newUser.save();

    //create token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    //add token to cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
    });

    return res
      .status(200)
      .json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error creating user' });
  }
};

const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Credentials' });
    }

    //verify password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
    });

    return res
      .status(200)
      .json({ success: true, message: 'User logged in successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error with user login' });
  }
};

const validateToken = async (req: Request, res: Response): Promise<any> => {
  try {
    res.status(200).send({ userId: req.userId });
  } catch (error) {
    res.status(500).send({ message: 'Error validating user' });
  }
};

const getCurrentUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error getting user' });
  }
};

const userLogout = async (req: Request, res: Response): Promise<any> => {
  try {
    // res.cookie('auth_token', '', { expires: new Date(0) });
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(1),
    });
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Error logging out user' });
  }
};

export default {
  createUser,
  loginUser,
  validateToken,
  getCurrentUser,
  userLogout,
};
