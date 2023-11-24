import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class basicInfoCalendar {
  @ApiProperty({
    type: "array",
    name: "banner",
    items: { type: "string", format: "binary" },
    description: "Calendar Banner Image",
  })
  banner: any;

  @ApiProperty({
    type: "array",
    name: "profile",
    items: { type: "string", format: "binary" },
    description: "Calendar profile Image",
  })
  profile: any;

  @ApiProperty({
    description: "Calendar BasicInfo Id!!!",
    example: "null",
  })
  @IsOptional()
  @IsString()
  basicInfoId: string;

  @ApiProperty({
    description: "Basic Info Title",
    example: "Test Title",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Basic Info Description",
    example: "Test description",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: "BlockChainType ID",
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  blockchainTypeId: string;

  @ApiProperty({
    description: "Calendar Basic Info Category",
    example: "Nft Category",
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: "Current Status of calendar",
    example: "Active",
  })
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty({
    description: "UserId that own the calender",
    example: "null",
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: "Cover Image URL",
    example: "null",
  })
  @IsNotEmpty()
  @IsString()
  IsCoveriImageExist: string | null;

  @ApiProperty({
    description: "Profile Image URL",
    example: "null",
  })
  @IsNotEmpty()
  @IsString()
  IsProfileImageExist: string | null;
}
