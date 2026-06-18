import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('stores')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  // Same endpoint handles both "submit" and "modify" — see ratings.service.ts
  @Post(':id/rating')
  submit(@Param('id') storeId: string, @Req() req, @Body() dto: CreateRatingDto) {
    return this.ratingsService.upsert(req.user.userId, storeId, dto.value);
  }
}
