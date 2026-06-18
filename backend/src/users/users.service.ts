import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

interface UserFilters {
  name?: string;
  email?: string;
  address?: string;
  role?: UserRole;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

const SORTABLE_FIELDS = ['name', 'email', 'address', 'role'];

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('An account with this email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      ...dto,
      password: hashed,
      role: dto.role || UserRole.USER,
    });
    const saved = await this.usersRepo.save(user);
    return this.sanitize(saved);
  }

  async findAll(filters: UserFilters) {
    const qb = this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.ownedStore', 'store')
      .leftJoinAndSelect('store.ratings', 'storeRating');

    if (filters.name) qb.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.email) qb.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
    if (filters.address) qb.andWhere('user.address ILIKE :address', { address: `%${filters.address}%` });
    if (filters.role) qb.andWhere('user.role = :role', { role: filters.role });

    const sortBy = SORTABLE_FIELDS.includes(filters.sortBy) ? filters.sortBy : 'name';
    qb.orderBy(`user.${sortBy}`, filters.order === 'DESC' ? 'DESC' : 'ASC');

    const users = await qb.getMany();
    return users.map((u) => this.toListItem(u));
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['ownedStore', 'ownedStore.ratings'],
    });
    if (!user) throw new NotFoundException('User not found');
    return this.toListItem(user);
  }

  // Strip password and shape the store-owner-only rating field
  private toListItem(user: User) {
    const base = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };
    if (user.role === UserRole.STORE_OWNER && user.ownedStore) {
      const ratings = user.ownedStore.ratings || [];
      const avg = ratings.length
        ? +(ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(2)
        : null;
      return { ...base, rating: avg };
    }
    return base;
  }

  private sanitize(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}
