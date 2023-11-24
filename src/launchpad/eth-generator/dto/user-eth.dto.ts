import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class userDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Enter contract address' })
  contractAddress: string;
  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ description: 'Enter wallet address' })
  // walletAddress: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Enter user id' })
  userId: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Enter salestype' })
  saleType: string;
}
