import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MenuCategoryService } from './menu.service';

@Controller('hotel/:hotelId/categories')
export class MenuController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @Post()
  create(@Param('hotelId') hotelId: string, @Body() data: { name: string; description?: string; image?: string }) {
    return this.menuCategoryService.create(+hotelId, data);
  }

  @Get()
  findAll(@Param('hotelId') hotelId: string) {
    return this.menuCategoryService.findAll(+hotelId);
  }

  @Get(':id')
  findOne(@Param('hotelId') hotelId: string, @Param('id') id: string) {
    return this.menuCategoryService.findOne(+hotelId, +id);
  }

  @Put(':id')
  update(@Param('hotelId') hotelId: string, @Param('id') id: string, @Body() data: { name?: string; description?: string; image?: string }) {
    return this.menuCategoryService.update(+hotelId, +id, data);
  }

  @Delete(':id')
  remove(@Param('hotelId') hotelId: string, @Param('id') id: string) {
    return this.menuCategoryService.remove(+hotelId, +id);
  }
}
