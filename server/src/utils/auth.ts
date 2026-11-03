import { CookieOptions } from 'express';

export const COOKIE_NAME = 'token';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 12 * 60 * 60 * 1000,
};
