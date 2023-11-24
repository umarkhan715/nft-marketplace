import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMarketplaceSolDto {
  @IsString()
  @IsNotEmpty()
  collectionAddress: string;
  @IsString()
  @IsNotEmpty()
  creartorAddress: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
}
