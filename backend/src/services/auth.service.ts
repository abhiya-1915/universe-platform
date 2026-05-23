import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository';
import { signToken } from '../utils/jwt';
import { Role } from '@prisma/client';

export class AuthService {
  async register(data: any) {
    const { email, password, name, role, username } = data;

    // Basic validation
    if (!email || !password || !name) {
      throw new Error('Email, password, and name are required.');
    }

    // Role-specific validation
    if (role === 'DSA' && !username) {
      throw new Error('DSA role requires a username.');
    }

    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) throw new Error('Email already in use.');

    if (username) {
      const existingUsername = await userRepository.findByUsername(username);
      if (existingUsername) throw new Error('Username already in use.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      email,
      passwordHash,
      name,
      role: role as Role || 'USER',
      username: username || null,
    });

    const token = signToken({ id: user.id, role: user.role });

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, username: user.username },
      token
    };
  }

  async login(data: any) {
    const { loginIdentifier, password } = data; // loginIdentifier can be email or username
    
    if (!loginIdentifier || !password) {
      throw new Error('Login identifier and password are required.');
    }

    // Check by email first, then username
    let user = await userRepository.findByEmail(loginIdentifier);
    if (!user) {
      user = await userRepository.findByUsername(loginIdentifier);
    }

    if (!user) throw new Error('Invalid credentials.');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error('Invalid credentials.');

    const token = signToken({ id: user.id, role: user.role });

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, username: user.username },
      token
    };
  }
}

export const authService = new AuthService();
