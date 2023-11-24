import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateButtonDto {
  @ApiProperty({ description: 'Enter theme' })
  @IsString()
  theme: string;
  @ApiProperty({ description: 'Enter buttonType' })
  @IsString()
  buttonType: string;
  @ApiProperty({ description: 'Enter fontsize' })
  @IsString()
  fontsize: string;
  @ApiProperty({ description: 'Enter fontStyle' })
  @IsString()
  fontStyle: string;
  @ApiProperty({ description: 'Enter color' })
  @IsString()
  color: string;
  @ApiProperty({ description: 'Enter backgroundColor' })
  @IsString()
  backgroundColor: string;
  @ApiProperty({ description: 'Enter margin' })
  @IsString()
  margin: string;
  @ApiProperty({ description: 'Enter padding' })
  @IsString()
  padding: string;
  @ApiProperty({ description: 'Enter borderRadius' })
  @IsString()
  borderRadius: string;
  @ApiProperty({ description: 'Enter shadow' })
  @IsString()
  shadow: string;
  @ApiProperty({ description: 'Enter id for update' })
  @IsString()
  id: string;
}
