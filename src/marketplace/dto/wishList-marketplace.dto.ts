import {
  IsString,
} from 'class-validator';

export class wishListmarketplaceDTO {
  @IsString()
  contractAddress: string;

  @IsString()
  userId: string;

  @IsString()
  nftuuid: string;
}
