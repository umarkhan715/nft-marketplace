import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEthMdRankDto {
  @ApiProperty({ description: 'Enter contractAddress' })
  @IsString()
  @IsNotEmpty()
  contractAddress: string;
  @ApiProperty({ description: 'Enter Userid' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
