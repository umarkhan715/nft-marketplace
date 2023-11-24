import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class querymarketplaceDTO {
  @IsString()
  @IsOptional()
  contractAddress: string;

  @IsString()
  @IsOptional()
  collections: string;

  @IsNumber()
  @IsOptional()
  nftId: number;

  @IsString()
  @IsOptional()
  userId: string;
}

export class marketpalceNftdto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  nftId: string;
  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  attributes: boolean;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  pageNo: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  limit: number;
}
