import { Request, Response, NextFunction } from 'express'; //imports express types for  Request/Response/middleware
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWTPayload } from '../modules/auth/auth.controller';
dotenv.config();

//this makes use of express request component structure and adds new property user whose value is set to be the payload
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

const jwt_secret_key: string | undefined = process.env.JWT_SECRET_KEY;

export const authMiddleware = (
  Req: AuthRequest,
  Res: Response,
  next: NextFunction,
) => {
  //extract authorization header from Request

  //get access to req.headquarters.authorization
  const authHeader = Req.headers.authorization;

  //validate
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    Res.status(401).json({
      message: 'No token provided',
    });
    return;
  }
  //if token is found, extract token from request authorization header
  const token = authHeader.split(' ')[1];

  try {
    const decoded = JWT.verify(token, jwt_secret_key!) as JWTPayload;
    // Verify the token by checking against the secret key created

    // if token is valid attach user to request and pass the control to the next middleware or controller
    Req.user = decoded;
    next();
  } catch (error) {
    return Res.status(403).json({
      message: 'Invalid or Expired token',
    });
  }
};
