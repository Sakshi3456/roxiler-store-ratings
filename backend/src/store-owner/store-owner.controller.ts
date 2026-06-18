import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { Store } from '../stores/store.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STORE_OWNER)
@Controller('store-owner/dashboard')
export class StoreOwnerController {
  constructor(@InjectRepository(Store) private storesRepo: Repository<Store>) {}

  @Get()
  async getDashboard(@Req() req) {
    const store = await this.storesRepo.findOne({
      where: { owner: { id: req.user.userId } },
      relations: ['ratings', 'ratings.user'],
    });

    if (!store) {
      return { message: 'No store has been linked to this account yet. Contact an administrator.' };
    }

    const average = store.ratings.length
      ? +(store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length).toFixed(2)
      : null;

    return {
      storeName: store.name,
      averageRating: average,
      totalRatings: store.ratings.length,
      raters: store.ratings.map((r) => ({
        name: r.user.name,
        email: r.user.email,
        rating: r.value,
      })),
    };
  }
}
