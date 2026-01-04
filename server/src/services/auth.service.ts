import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export interface RegisterData {
  email: string;
  displayName: string;
  handle: string;
  bio?: string;
  tags?: string[];
  verificationCode: string;
}

export interface LoginData {
  email: string;
}

export class AuthService {
  async register(data: RegisterData) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Check if handle already exists
    const existingHandle = await prisma.user.findUnique({
      where: { handle: data.handle },
    });

    if (existingHandle) {
      throw new AppError('Handle already taken', 400);
    }

    // Verify code
    const code = await prisma.verificationCode.findUnique({
      where: { code: data.verificationCode },
    });

    if (!code) {
      throw new AppError('Invalid verification code', 400);
    }

    if (code.used) {
      throw new AppError('Verification code already used', 400);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        displayName: data.displayName,
        handle: data.handle,
        bio: data.bio,
        tags: data.tags || [],
      },
    });

    // Mark code as used
    await prisma.verificationCode.update({
      where: { id: code.id },
      data: {
        used: true,
        usedBy: user.id,
        usedAt: new Date(),
      },
    });

    // Create creator if Founding 50
    if (code.tier === 'founding' || code.tier === 'master') {
      await prisma.creator.create({
        data: {
          userId: user.id,
          name: data.displayName,
          handle: data.handle,
          isFounding50: code.tier === 'founding',
          stats: {
            fans: '0',
            series: '0',
            views: '0',
          },
        },
      });
    }

    // Generate token
    const token = this.generateToken(user.id, user.email);

    return { user, token };
  }

  async login(data: LoginData) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = this.generateToken(user.id, user.email);

    return { user, token };
  }

  private generateToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }
}

export const authService = new AuthService();


