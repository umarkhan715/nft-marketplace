import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from "class-validator";

enum walletType {
  Solana = "Solana",
  Ethereum = "Ethereum",
  Tokamak = "Tokamak",
}
export class CreateAuthDto {
  @IsNotEmpty()
  @IsEnum(walletType, {
    message: "Value should be Solana || Ethereum || Tokamak", //i18nValidationMessage('validation.', { message: 'Not good ' }),
  })
  @ApiProperty({
    description: "Value should be Solana || Ethereum || Tokamak",
    example: "ethereum",
  })
  wallettype: walletType;

  @ApiProperty({
    description: "The Wallet Address should of Ethereum and Phantom ",
    //example: '',
  })
  @ApiProperty({
    description: "User Wallet Address",
    example: "0x9Ccfb59E1c8695C6Bc2c87c3De52477D29Fe1416",
  })
  @IsString()
  @IsNotEmpty()
  wallet: string;
}

export class SubcriptionsDto {
  @ApiProperty({
    description: "Subcriptions Id that should be either string or null",
    example: "null",
  })
  Id: string | null;

  @ApiProperty({
    description: "Subcriptions status either true or false",
    example: false,
  })
  @IsBoolean()
  subscription: boolean;

  @ApiProperty({
    description: "UserId that want to Get Subcription!!",
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
