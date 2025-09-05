import { Controller, Get, Post, Put, Delete, Param, Body, Patch } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';

@Controller('hotel/:hotelId')
export class MenuItemController {
    constructor(private readonly menuItemService: MenuItemService) {}

    @Post('items')
    create(@Param('hotelId') hotelId: string, @Body() data: { category_id: number; name: string; description?: string; price: number; available?: boolean }) {
        return this.menuItemService.create(+hotelId, data);
    }

    @Get('items')
    findAll(@Param('hotelId') hotelId: string) {
        return this.menuItemService.findAll(+hotelId);
    }

    @Get('items/:itemId')
    findOne(@Param('hotelId') hotelId: string, @Param('itemId') itemId: string) {
        return this.menuItemService.findOne(+hotelId, +itemId);
    }

    @Put('items/:itemId')
    update(@Param('hotelId') hotelId: string, @Param('itemId') itemId: string, @Body() data: { category_id?: number; name?: string; description?: string; price?: number; available?: boolean }) {
        return this.menuItemService.update(+hotelId, +itemId, data);
    }

    @Delete('items/:itemId')
    remove(@Param('hotelId') hotelId: string, @Param('itemId') itemId: string) {
        return this.menuItemService.remove(+hotelId, +itemId);
    }

    @Patch('item/:itemId/availability')
    updateAvailability(@Param('hotelId') hotelId: string, @Param('itemId') itemId: string, @Body('available') available: boolean) {
        return this.menuItemService.updateAvailability(+hotelId, +itemId, available);
    }
}

@Controller('hotel/:hotelId/categories/:categoryId')
export class CategoryItemController {
    constructor(private readonly menuItemService: MenuItemService) {}

    @Get('items')
    findByCategory(@Param('hotelId') hotelId: string, @Param('categoryId') categoryId: string) {
        return this.menuItemService.findByCategory(+hotelId, +categoryId);
    }
}
