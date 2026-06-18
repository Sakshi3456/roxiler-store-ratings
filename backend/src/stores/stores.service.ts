import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { User } from '../users/user.entity';

interface StoreFilters {
  name?: string;
  email?: string;
  address?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

const SORTABLE_FIELDS = ['name', 'email', 'address', 'rating'];

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storesRepo: Repository<Store>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateStoreDto) {
    const existing = await this.storesRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('A store with this email already exists');

    let owner: User | undefined;
    if (dto.ownerId) {
      owner = await this.usersRepo.findOne({ where: { id: dto.ownerId } });
      if (!owner) throw new NotFoundException('Owner user not found');
    }

    const store = this.storesRepo.create({
      name: dto.name,
      email: dto.email,
      address: dto.address,
      owner,
    });
    return this.storesRepo.save(store);
  }

  // Used by the admin store listing screen
  async findAllForAdmin(filters: StoreFilters) {
    const qb = this.storesRepo.createQueryBuilder('store').leftJoinAndSelect('store.ratings', 'rating');

    if (filters.name) qb.andWhere('store.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.email) qb.andWhere('store.email ILIKE :email', { email: `%${filters.email}%` });
    if (filters.address) qb.andWhere('store.address ILIKE :address', { address: `%${filters.address}%` });

    const stores = await qb.getMany();
    const mapped = stores.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      rating: s.ratings.length
        ? +(s.ratings.reduce((sum, r) => sum + r.value, 0) / s.ratings.length).toFixed(2)
        : null,
    }));

    const sortBy = SORTABLE_FIELDS.includes(filters.sortBy) ? filters.sortBy : 'name';
    const dir = filters.order === 'DESC' ? -1 : 1;
    mapped.sort((a, b) => {
      const av = a[sortBy] ?? '';
      const bv = b[sortBy] ?? '';
      if (av > bv) return dir;
      if (av < bv) return -dir;
      return 0;
    });
    return mapped;
  }

  // Used by the normal-user store listing screen: includes the
  // logged-in user's own rating for each store, if they've left one.
  async findAllForUser(search: string, userId: string) {
    const qb = this.storesRepo
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.ratings', 'rating')
      .leftJoinAndSelect('rating.user', 'ratingUser');

    if (search) {
      qb.andWhere('(store.name ILIKE :s OR store.address ILIKE :s)', { s: `%${search}%` });
    }

    const stores = await qb.getMany();
    return stores.map((s) => {
      const overall = s.ratings.length
        ? +(s.ratings.reduce((sum, r) => sum + r.value, 0) / s.ratings.length).toFixed(2)
        : null;
      const own = s.ratings.find((r) => r.user?.id === userId);
      return {
        id: s.id,
        name: s.name,
        address: s.address,
        overallRating: overall,
        userRating: own ? own.value : null,
      };
    });
  }
}
