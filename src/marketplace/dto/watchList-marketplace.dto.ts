import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class watchListmarketplaceDTO {
  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
