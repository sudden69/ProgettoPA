import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../db';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';

interface CustomRequest extends Request {
  userId: string;
}

export const generateToken = (userId: string, email: string): string => {
  const payload = { userId, email };
  const options = { expiresIn: '24h' };

  return jwt.sign(payload, secretKey, options);
};

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
};

export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const userId = req.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

