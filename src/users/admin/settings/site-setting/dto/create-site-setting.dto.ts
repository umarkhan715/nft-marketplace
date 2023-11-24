import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSiteSettingDto {
  @ApiProperty({ description: 'Enter keywords' })
  @IsString()
  keywords: string;
  // @IsString()
  @ApiProperty({ description: 'logo image' })
  logo: string;
  // @IsString()
  @ApiProperty({ description: 'banner image' })
  banner: string;
  @IsString()
  @ApiProperty({ description: 'Enter description' })
  description: string;
  @IsString()
  @ApiProperty({ description: 'Enter title' })
  title: string;
  @ApiProperty({ description: 'Enter userId if for update' })
  @IsString()
  id: string;
}
