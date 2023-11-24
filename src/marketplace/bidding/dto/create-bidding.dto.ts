import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class CreateBiddingDto {
  tokenId: string;
  tokenPrice: string;
  time: string;
  tokenAddress: string;
  signature: string;

  @IsBoolean()
  @IsNotEmpty()
  bidAccepted: boolean;

  @IsOptional()
  coinAddress: string;

  @IsOptional()
  BidType: string;

  @IsNotEmpty()
  @IsString()
  caller: string;

  @IsNotEmpty()
  @IsString()
  highestBid: string;

  @IsNotEmpty()
  @IsString()
  highestBidder: string;

  @IsNotEmpty()
  @IsString()
  marketplaceNftId: string;

  @IsNotEmpty()
  @IsString()
  marketPlaceCollectionId: string;

  @IsNotEmpty()
  @IsString()
  marketplaceAuctionId: string;
}
