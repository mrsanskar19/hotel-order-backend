
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getHotels() {
    return this.prisma.hotel.findMany();
  }

  async getHotelById(id: string) {
    return this.prisma.hotel.findUnique({
      where: { hotel_id: parseInt(id, 10) },
    });
  }

  async deleteHotelById(id: string) {
    return this.prisma.hotel.delete({
      where: { hotel_id: parseInt(id, 10) },
    });
  }

  async getUsers() {
    // Assuming you have a user model
    return this.prisma.admin.findMany();
  }

  async getUserById(id: string) {
    return this.prisma.admin.findUnique({
      where: { admin_id: parseInt(id, 10) },
    });
  }

  async deleteUserById(id: string) {
    return this.prisma.admin.delete({
      where: { admin_id: parseInt(id, 10) },
    });
  }
}
