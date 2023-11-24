import { IsNumber, IsString } from "class-validator";

export class CreateAuctionDto {
  @IsNumber()
  tokenId: number;
  @IsString()
  minBid: string; // Selling Price
  @IsString()
  expiryTime: string;
  @IsString()
  createdTime: string;
  @IsString()
  tokenAmount: string;
  @IsString()
  tokenAddress: string;
  @IsString()
  coinAddress: string; // can be eth or any Erc-20 token
  @IsString()
  signature: string;
}
