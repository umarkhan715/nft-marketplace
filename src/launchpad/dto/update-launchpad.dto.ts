import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsNotEmpty,
} from "class-validator";

export class UpdateLaunchpadDto {
  @ApiProperty({ required: true })
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  launchPadProjectId: string;

  @ApiProperty({ required: true })
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  userid: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  walletAddress: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ required: false, items: { type: "string", format: "number" } })
  @IsNumber()
  @IsOptional()
  total_quantity: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  twitter_link: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  discord_link: string;

  @ApiProperty({
    type: "array",
    name: "profileImage",
    items: { type: "string", format: "binary" },
    description: "Profile Image for Launchpad",
    required: false,
  })
  profileImage: any;

  @ApiProperty({
    type: "array",
    name: "bannerImage",
    items: { type: "string", format: "binary" },
    description: "banner Image for Launchpad",
    required: false,
  })
  bannerImage: any;
}
