import { IsEmail, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @Length(20, 60, { message: 'Name must be between 20 and 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @Length(1, 400, { message: 'Address must not exceed 400 characters' })
  address: string;

  // Optional: link this store to an existing STORE_OWNER user at creation time
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}
