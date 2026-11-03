import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { IUser, User } from '../../models/users';
import JWT from 'jsonwebtoken';
import { AuthRequest } from '../../middleware/auth.middleware';
import { loginSchema, registerSchema } from '../../schemas';
import { COOKIE_NAME, cookieOptions } from '../../utils/auth';

export interface JWTPayload {
  userId: string;
}

const toPublicUser = (u: IUser) => ({
  id: u._id,
  fullname: u.fullname,
  email: u.email,
});

const generateToken = ({ userId }: JWTPayload) => {
  const jwt_secret_key: string | undefined = process.env.JWT_SECRET_KEY;
  return JWT.sign({ userId }, jwt_secret_key!, {
    expiresIn: '1d',
  });
};

export async function signUp(req: Request, res: Response) {
  const data = registerSchema.safeParse(req.body);

  if (!data.success) {
    res
      .status(400)
      .json({ success: false, message: data.error.issues[0].message });
    return;
  }

  const { fullname, email, password } = data.data;

  try {
    //Hash Passwords before creating a user to avoid malicious attack
    //check database if user exists using (findOne())
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'A user already exists with this email address',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser: IUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    const createdUser = await newUser.save(); //saves the user in mongo

    // const payload: JWTPayload = {
    //   userId: createdUser._id.toString(),
    // };

    // const jwtKey = process.env.JWT_SECRET_KEY;

    // const token = JWT.sign(payload, jwtKey!, { expiresIn: '15m' });

    res.cookie(
      COOKIE_NAME,
      generateToken({ userId: createdUser._id.toString() }),
      cookieOptions,
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: createdUser._id,
        email: createdUser.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export async function signIn(req: Request, res: Response) {
  console.log('sign-in route hit');

  const data = loginSchema.safeParse(req.body);
  if (!data.success) {
    res
      .status(400)
      .json({ success: false, message: data.error.issues[0].message });
    return;
  }
  const { email, password } = data.data;
  try {
    const existingUser = await User.findOne({ email });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
      return;
    }

    res.cookie(
      COOKIE_NAME,
      generateToken({ userId: existingUser._id.toString() }),
      cookieOptions,
    );

    res.status(200).json({
      success: true,
      message: 'User sign in successfully',
      user: {
        id: existingUser._id,
        email: existingUser.email,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

export const logout = (_req: AuthRequest, res: Response) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

export async function getUser(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: 'Authentication required' });
      return;
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ success: true, user: toPublicUser(currentUser) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
