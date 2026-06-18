import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { Store } from '../stores/store.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingsRepo: Repository<Rating>,
    @InjectRepository(Store) private storesRepo: Repository<Store>,
  ) {}

  // A user submitting a rating for a store they've already rated
  // updates that rating instead of creating a second row.
  async upsert(userId: string, storeId: string, value: number) {
    const store = await this.storesRepo.findOne({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

    let rating = await this.ratingsRepo.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
    });

    if (rating) {
      rating.value = value;
    } else {
      rating = this.ratingsRepo.create({
        user: { id: userId } as any,
        store: { id: storeId } as any,
        value,
      });
    }
    return this.ratingsRepo.save(rating);
  }
}
