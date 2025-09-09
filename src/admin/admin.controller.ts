
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('hotels')
  async getHotels() {
    return this.adminService.getHotels();
  }

  @Get('hotels/:id')
  async getHotelById(@Param('id') id: string) {
    return this.adminService.getHotelById(id);
  }

  @Delete('hotels/:id')
  async deleteHotelById(@Param('id') id: string) {
    return this.adminService.deleteHotelById(id);
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Delete('users/:id')
  async deleteUserById(@Param('id') id: string) {
    return this.adminService.deleteUserById(id);
  }

}
