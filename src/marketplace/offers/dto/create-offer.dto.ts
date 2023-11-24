import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
export class CreateOfferDto {
  tokenId: string;
  Price: string;
  tokenAmount: string; //number of tokens of each token id

  tokenAddress: string;
  signature: string;

  @IsBoolean()
  @IsNotEmpty()
  isactive: boolean;

  @IsNumber()
  @IsNotEmpty()
  coinAddress: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  offerAccepted: boolean;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsNumber()
  @IsNotEmpty()
  marketplaceNftId: string;

  @IsString()
  @IsNotEmpty()
  marketPlaceCollectionId: string;
}
