import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinDate,
  ValidateNested,
} from 'class-validator';
class basic {
  @ApiProperty({ description: 'Enter projectName' })
  @IsString()
  @IsOptional()
  projectName: string;

  @ApiProperty({ description: 'Enter description' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Enter Width' })
  @IsNumber()
  @IsOptional()
  dimensionHeight: number;

  @ApiProperty({ description: 'Enter height' })
  @IsNumber()
  @IsOptional()
  dimensionWidth: number;

  @ApiProperty({ description: 'Enter walletAddress' })
  @IsString()
  @IsOptional()
  walletAddress: string;

  @ApiProperty({ description: 'Enter quantity of collection' })
  @IsNumber()
  @IsOptional()
  quantityOfCollection: number;

  @ApiProperty({ description: 'Enter UserId' })
  @IsString()
  @IsOptional()
  userId: string;
}
class imageArray {
  @ApiProperty({ description: 'User Given  name' })
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  file: string;

  @ApiProperty({ description: 'Program calculated Occurance' })
  @IsOptional()
  occurance: number;

  @ApiProperty({ description: 'Program calculated Rarity' })
  @IsOptional()
  rarity: number;

  @ApiProperty({ description: 'Program calculated base64' })
  @IsString()
  @IsOptional()
  base64: string;
}
class array {
  @ApiProperty({ description: 'Enter name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'attributes object', type: [imageArray] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => imageArray)
  image: imageArray[];
}
export class CreateEthGeneratorDto {
  @ApiProperty({
    type: [basic],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => basic)
  basic: basic[];

  @ApiProperty({
    type: [array],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => array)
  array: array[];
}
