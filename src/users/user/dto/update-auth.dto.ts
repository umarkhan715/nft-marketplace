import { ApiBody, ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class UpdateAuthDto {
  @ApiProperty({
    description: "this is user prifile url",
    example: "http://localhost:3001/public/calendar/default/profile.png",
  })
  @IsNotEmpty()
  @IsOptional()
  profileurl: string | null;

  @ApiProperty({
    description: "this is user cover url",
    example: "http://localhost:3001/public/calendar/default/banner.jpeg",
  })
  @IsNotEmpty()
  @IsString()
  coverurl: string | null;

  @ApiProperty({
    description: "username is required",
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({
    description: "discord liink is required",
    example: "John https://discord.com/",
  })
  @IsOptional()
  @IsString()
  discordlink: string;

  @ApiProperty({
    description: "twitter liink is required",
    example: "https://twitter.com/home",
  })
  @IsOptional()
  @IsString()
  twitterlink: string;

  @ApiProperty({
    description: "user active or not active",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: "user spending amount",
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  spendingAmount: number;

  @ApiProperty({
    description: "user role id ",
    example: null,
  })
  @IsOptional()
  @IsString()
  roleId: string;

  @ApiProperty({
    description: "user refreshToken",
    example: null,
  })
  @IsOptional()
  @IsString()
  refreshToken: string;

  @ApiProperty({
    description: "user id",
    example: null,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    type: "array",
    description: "user can upload his profileImage",
    name: "profileImage",
    items: { type: "string", format: "binary" },
  })
  profileImage: any;

  @ApiProperty({
    type: "array",
    name: "coverImage",
    description: "user can upload his coverImage",
    items: { type: "string", format: "binary" },
  })
  coverImage: any;
}
