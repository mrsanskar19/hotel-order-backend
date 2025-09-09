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
      throw new BadRequestException('Username and password are required');
    }

   const hotel = await this.prisma.hotel.findFirst({
      where: { username: data.username },
    });

    if (!hotel) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const passwordMatch = await bcrypt.compare(data.password, hotel.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid username or password');
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
