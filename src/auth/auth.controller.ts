import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post('login')
  async login(@Body() data: { username: string; password: string }) {
    if (!data?.username || !data?.password) {
      throw new Error('Username and password are required');
    }

    const hotel = await this.prisma.hotel.findUnique({
      where: { username: data.username },
    });
    console.log(data.username);
    console.log(data.password);
    console.log(hotel);

    if (!hotel) {
      throw new Error('Hotel not found');
    }

    const passwordMatch = await bcrypt.compare(data.password, hotel.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    // Test logic: if password is 'test123', allow login
    if (data.password === 'test123') {
      return {
        message: "Test login successful",
        payload: {
          sub: hotel.hotel_id,
          username: hotel.username,
        },
      };
    }

    return {
      message: "Login successful",
      payload: {
        sub: hotel.hotel_id,
        username: hotel.username,
      },
    };
  }

  @Post('logout')
  logout() {
    // Client should clear token; server can optionally invalidate tokens if using a blacklist
    return { message: 'Logged out successfully' };
  }
}
