import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../stores/store.entity';
import { StoreOwnerController } from './store-owner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoreOwnerController],
})
export class StoreOwnerModule {}
