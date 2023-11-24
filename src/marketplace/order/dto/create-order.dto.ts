import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  tokenId: string;
  @ApiProperty()
  @IsNotEmpty()
  tokenAddress: string;
  @ApiProperty()
  @IsNotEmpty()
  marketplaceNftId: string;
  @ApiProperty()
  @IsNotEmpty()
  caller: string;
  @ApiProperty()
  @IsNotEmpty()
  ethPrice: string;
  @ApiProperty()
  @IsNotEmpty()
  tokenPrice: string;
  @ApiProperty()
  @IsNotEmpty()
  coinAddress: string;
  @ApiProperty()
  @IsNotEmpty()
  signature: string;
  @ApiProperty()
  @IsNotEmpty()
  contractTuple: string;
  @ApiProperty()
  @IsNotEmpty()
  createdTime: string;
  @ApiProperty()
  @IsNotEmpty()
  tokenAmount: string;
  @ApiProperty()
  @IsNotEmpty()
  transactionHash: string;
}

export class OrderQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  orderid: string;
  @ApiProperty({ required: false })
  @IsOptional()
  tokenId: string;
  @ApiProperty({ required: false })
  @IsOptional()
  tokenAddress: string;
  @ApiProperty({ required: false })
  @IsOptional()
  marketplaceNftId: string;
  @ApiProperty({ required: false })
  @IsOptional()
  ethPrice: string;
  @ApiProperty({ required: false })
  @IsOptional()
  marketplaceCollectionId: string;
}
