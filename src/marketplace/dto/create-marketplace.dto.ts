import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMarketplaceDto {
  @ApiProperty({ description: "Enter ContractAddress" })
  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @ApiProperty({ description: "User Id" })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class MarketplaceCollectionDto {
  @ApiProperty({ description: "Enter ContractAddress" })
  @IsString()
  @IsNotEmpty()
  contractAddress: string;
}
