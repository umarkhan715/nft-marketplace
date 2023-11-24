import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSolMdRankDto {
  @ApiProperty({ description: 'Enter collectionAddress' })
  @IsString()
  @IsNotEmpty()
  collectionAddress: string;
  @ApiProperty({ description: 'Enter creartorAddress' })
  @IsString()
  @IsNotEmpty()
  creartorAddress: string;
  @ApiProperty({ description: 'Enter userId' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
