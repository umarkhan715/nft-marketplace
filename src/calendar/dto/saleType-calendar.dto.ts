import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class saletypes {
  @ApiProperty({
    description: 'User ID that own the Calendar',
    example: 'null',
  })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({
    description: 'Launch Type Date',
    example: 'Pre-Sale',
  })
  @IsString()
  @IsNotEmpty()
  launchType: string;

  @ApiProperty({
    description: 'Launch Date of the Calendar',
    example: `${Date.now().toString()}`,
  })
  @IsDate()
  @IsOptional()
  launchDate: Date;

  @ApiProperty({
    description: 'Price of the Calendar',
    example: 200,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'End Date of the Calendar',
    example: `${Date.now().toString()}`,
  })
  @IsDate()
  @IsOptional()
  endTime: Date;
}
export class createSaleType {
  @ApiProperty({
    description: 'Sale Type of the Calendar',
    type: [saletypes],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => saletypes)
  saletypes: saletypes[];

  @ApiProperty({
    description: 'Calendar Id',
  })
  @IsString()
  calendarId: string;
}
