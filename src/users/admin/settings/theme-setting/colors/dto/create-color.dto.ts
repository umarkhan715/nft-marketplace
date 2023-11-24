import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateColorDto {
  @ApiProperty({ description: 'Enter theme' })
  @IsString()
  theme: string;
  @ApiProperty({ description: 'Enter type' })
  @IsString()
  type: string;
  @ApiProperty({ description: 'Enter color' })
  @IsString()
  color: string;
  @ApiProperty({ description: 'Enter id for update' })
  @IsString()
  id: string;
}
