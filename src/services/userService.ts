import { User } from '../db';
import { UserInstance } from '../models/models'; // Importa l'interfaccia per il modello User

export const createUser = async (email: string, password: string): Promise<UserInstance> => {
  try {
    const user = await User.create({ email, password });
    return user;
  } catch (error) {
    throw new Error('Failed to create user');
  }
};

export const getUserByEmail = async (email: string): Promise<UserInstance | null> => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw new Error('Failed to get user by email');
  }
};
