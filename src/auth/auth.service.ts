import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(data: { username: string; password: string }) {
    if (!data?.username || !data?.password) {
      throw new BadRequestException('Username and password are required');
    }

    const hotel = await this.prisma.hotel.findFirst({
      where: { username: data.username },
    });

    if (!hotel) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(data.password, hotel.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: hotel.hotel_id, username: hotel.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
