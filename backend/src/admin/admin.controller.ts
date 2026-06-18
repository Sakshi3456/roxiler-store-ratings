import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { User, UserRole } from '../users/user.entity';
import { Store } from '../stores/store.entity';
import { Rating } from '../ratings/rating.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/dashboard')
export class AdminController {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Store) private storesRepo: Repository<Store>,
    @InjectRepository(Rating) private ratingsRepo: Repository<Rating>,
  ) {}

  @Get()
  async getStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.usersRepo.count(),
      this.storesRepo.count(),
      this.ratingsRepo.count(),
    ]);
    return { totalUsers, totalStores, totalRatings };
  }
}
