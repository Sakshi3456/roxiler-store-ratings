import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { User } from '../users/user.entity';
import { StoresService } from './stores.service';
import { AdminStoresController, StoresController } from './stores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User])],
  providers: [StoresService],
  controllers: [AdminStoresController, StoresController],
  exports: [StoresService],
})
export class StoresModule {}
