import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ description: 'Enter tool Name' })
  @IsString()
  toolName: string;
  @IsBoolean()
  @ApiProperty({ description: 'Enter tool status' })
  status: boolean;
  @ApiProperty({ description: 'Enter id for update' })
  @IsString()
  id: string;
}
