import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: { username: string; password: string }) {
    if (!data?.username || !data?.password) {
      throw new BadRequestException('Username and password are required');
    }
    return this.authService.login(data);
  }

  @Post('logout')
  logout() {
    // Client should clear token; server can optionally invalidate tokens if using a blacklist
    return { message: 'Logged out successfully' };
  }
}
