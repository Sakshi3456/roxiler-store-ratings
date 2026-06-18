import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Available to any authenticated role: admin, normal user, or store owner
  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return this.authService.updatePassword(req.user.userId, dto.oldPassword, dto.newPassword);
  }
}
