import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { storage } from "./storage";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function loginUser(username: string, password: string) {
  const user = await storage.getUserByUsername(username);
  
  if (!user) {
    return { success: false, message: 'Invalid username or password' };
  }

  const isValid = await comparePassword(password, user.password);
  
  if (!isValid) {
    return { success: false, message: 'Invalid username or password' };
  }

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      name: user.name
    }
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }
  next();
}
