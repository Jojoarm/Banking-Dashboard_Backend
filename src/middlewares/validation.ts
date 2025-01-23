import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateUserSignUpRequest = [
  check('firstName', 'First Name is required').isString(),
  check('lastName', 'Last Name is required').isString(),
  check('email', 'Email is required').isEmail(),
  check('password', 'Password with 6 or more characters required').isLength({
    min: 6,
  }),
  check('address1', 'Address is required').isString(),
  check('city', 'City is required').isString(),
  check('state', 'State is required').isString(),
  check('postalCode', 'Postal Code is required').isString(),
  check('dateOfBirth', 'Dob is required').isString(),
  check('ssn', 'ssn is required').isString(),
  handleValidationErrors,
];

export const validateUserLoginRequest = [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password with 6 or more characters required').isLength({
    min: 6,
  }),
  handleValidationErrors,
];
