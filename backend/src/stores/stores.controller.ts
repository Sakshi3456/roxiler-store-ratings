import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';

// Admin: create + list/filter/sort all stores
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/stores')
export class AdminStoresController {
  constructor(private storesService: StoresService) {}

  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.storesService.findAllForAdmin(query);
  }
}

// Normal user: browse + search stores, see own rating alongside overall rating
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  findAll(@Query('search') search: string, @Req() req) {
    return this.storesService.findAllForUser(search, req.user.userId);
  }
}
