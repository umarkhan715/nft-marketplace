import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFontDto {
  @ApiProperty({ description: 'Enter h1' })
  @IsString()
  h1: string;
  @ApiProperty({ description: 'Enter h2' })
  @IsString()
  h2: string;
  @ApiProperty({ description: 'Enter h3' })
  @IsString()
  h3: string;
  @ApiProperty({ description: 'Enter h4' })
  @IsString()
  h4: string;
  @ApiProperty({ description: 'Enter h5' })
  @IsString()
  h5: string;
  @ApiProperty({ description: 'Enter h6' })
  @IsString()
  h6: string;
  @ApiProperty({ description: 'Enter id for update' })
  @IsString()
  id: string;
  @ApiProperty({ description: 'Enter span' })
  @IsString()
  span: string;
  @ApiProperty({ description: 'Enter googleFont ' })
  @IsString()
  googleFont: string;
}
