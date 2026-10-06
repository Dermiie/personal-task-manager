import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { IUser, User } from '../../models/users';
import JWT from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
}

const generateToken = ({ userId }: JWTPayload) => {
  const jwt_secret_key: string | undefined = process.env.JWT_SECRET_KEY;
  return JWT.sign({ userId }, jwt_secret_key!, {
    expiresIn: '1d',
  });
};

export async function signUp(req: Request, res: Response) {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res.status(400).json({
      success: false,
      message: 'Please provide all required details',
    });
    return;
  }

  //check database if user exists using (findOne())
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({
      success: false,
      message: 'A user already exists with this email address',
    });
    return;
  }

  try {
    //Hash Passwords before creating a user to avoid malicious attack

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser: IUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const createdUser = await newUser.save(); //saves the user in mongo

    const payload: JWTPayload = {
      userId: createdUser._id.toString(),
    };

    const jwtKey = process.env.JWT_SECRET_KEY;

    const token = JWT.sign(payload, jwtKey!, { expiresIn: '15m' });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: createdUser._id,
        email: createdUser.email,
      },
      token,
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

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Please provide all required details',
    });
    return;
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    res.status(401).json({
      success: false,
      message: 'Password dont match',
    });
    return;
  }

  try {
    const payload = { userId: existingUser._id.toString() };

    const token = generateToken(payload);

    res.status(200).json({
      success: true,
      message: 'User sign in successfully',
      user: {
        id: existingUser._id,
        email: existingUser.email,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
