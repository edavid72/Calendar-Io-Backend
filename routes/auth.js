/*
User Routes / Auth
host + /api/auth
*/
import { Router } from 'express';
import { check } from 'express-validator';
import { createUser, loginUser, revalidateToken } from '../controllers/auth.js';
import { fieldValidator } from '../middlewares/field_validator.js';
import { validateJWT } from '../middlewares/validate_jwt.js';

const authRouter = Router();

authRouter.post(
  '/register',
  [
    check('name', 'Name is a required character').not().isEmpty(),
    check('email', 'Email is a required character').isEmail(),
    check(
      'password',
      'The password must contain at least 6 characters'
    ).isLength({ min: 6 }),
    fieldValidator,
  ],
  createUser
);

authRouter.post(
  '/',
  [
    check('email', 'Email is a required character').isEmail(),
    check(
      'password',
      'The password must contain at least 6 characters'
    ).isLength({ min: 2 }),
    fieldValidator,
  ],
  loginUser
);

authRouter.get('/renew', validateJWT, revalidateToken);

export default authRouter;
