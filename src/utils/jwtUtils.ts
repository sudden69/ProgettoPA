import * as jwt from 'jsonwebtoken';
import { Request as ExpressRequest } from 'express';
import  { JwtPayload } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

export const getUserFromToken = (req: ExpressRequest): any => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decodedToken = jwt.verify(token, secretKey);
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid token');
    }
  } else {
    throw new Error('Token not provided');
  }
};


export const verifyToken = (token: string): JwtPayload | undefined => {
  try {
    const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
    return decodedToken;
  } catch (error) {
    console.error('Invalid token:', error);
    return undefined;
  }
};

export { secretKey };

