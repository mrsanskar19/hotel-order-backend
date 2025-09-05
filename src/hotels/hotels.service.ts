import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description?: string; email?: string; phone?: string; address?: string; images?: string; active_time?: string; parcel_available?: boolean; is_active?: boolean; username: string; password: string }) {
    if (!data.name || !data.username || !data.password) {
      throw new BadRequestException('Name, username, and password are required');
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new BadRequestException('Invalid email format');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.hotel.create({
      data: { ...data, password: hashedPassword },
    });
  }

  findOne(id: number) {
    return this.prisma.hotel.findUnique({ where: { hotel_id: id } });
  }

  async update(id: number, data: { name?: string; description?: string; email?: string; phone?: string; address?: string; images?: string; active_time?: string; parcel_available?: boolean; is_active?: boolean; username?: string; password?: string }) {
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new BadRequestException('Invalid email format');
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.hotel.update({ where: { hotel_id: id }, data });
  }

  remove(id: number) {
    return this.prisma.hotel.delete({ where: { hotel_id: id } });
  }
}
