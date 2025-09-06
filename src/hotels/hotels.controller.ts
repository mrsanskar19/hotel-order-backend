import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { HotelService } from './hotels.service';

@Controller('hotel')
export class HotelsController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  create(@Body() data: { name: string; description?: string; email?: string; phone?: string; address?: string; images?: string; active_time?: string; parcel_available?: boolean; is_active?: boolean; username: string; password: string }) {
    return this.hotelService.create(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: { name?: string; description?: string; email?: string; phone?: string; address?: string; images?: string; active_time?: string; parcel_available?: boolean; is_active?: boolean; username?: string; password?: string }) {
    return this.hotelService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelService.remove(+id);
  }
  @Get(':id/report')
  getHotelReport(@Param('id') id: string) {
    return this.hotelService.getHotelReport(+id);
  }

  @Get(':id/revenue')
  getHotelRevenue(@Param('id') id: string) {
    return this.hotelService.getHotelRevenue(+id);
  }
}
