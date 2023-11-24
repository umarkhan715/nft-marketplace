import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
class basic {
  @ApiProperty({ description: 'Enter' })
  @IsString()
  @IsOptional()
  projectName: string;
  @ApiProperty({ description: 'Enter' })
  @IsString()
  @IsOptional()
  symbol: string;

  @ApiProperty({ description: 'Enter' })
  @IsString()
  @IsOptional()
  creator: string;

  @ApiProperty({ description: 'Enter' })
  @IsString()
  @IsOptional()
  sfbp: string;

  @ApiProperty({ description: 'Enter description' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Enter canvas Height' })
  @IsNumber()
  @IsOptional()
  dimensionHeight: number;

  @ApiProperty({ description: 'Enter canvas Width' })
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

  @ApiProperty({ description: 'Enter userId' })
  @IsNumber()
  @IsOptional()
  userId: string;
}
class imageArray {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  file: string;
  @ApiProperty({ description: 'calculated occurance' })
  @IsOptional()
  occurance: number;
  @ApiProperty({ description: 'calculated rarity' })
  @IsOptional()
  rarity: number;
  @ApiProperty({ description: 'base64 of image' })
  @IsString()
  @IsOptional()
  base64: string;
}
class array {
  @ApiProperty({ description: 'Enter projectName' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ type: [imageArray] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => imageArray)
  image: imageArray[];
}
export class CreateSolGeneratorDto {
  @ApiProperty({ type: [basic] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => basic)
  basic: basic[];

  @ApiProperty({ type: [array] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => array)
  array: array[];
}
