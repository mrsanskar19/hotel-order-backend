import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    // async validateHotel(username: string, password: string) {
    //     const hotel = await this.prisma.hotel.findUnique({ where: { username:username } });
    //     if (hotel || !(await bcrypt.compare(password, hotel.password))) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }
    //     return hotel;
    // }
}
