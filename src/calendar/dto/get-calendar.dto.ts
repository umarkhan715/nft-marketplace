import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
  IsUUID,
} from "class-validator";

enum querydata {
  all = "all",
  socialLinks = "socialLinks",
  saleType = "saleType",
  team = "team",
  artGallery = "artGallery",
}

export class getCalendar {
  @ApiProperty({
    description: "User Id that own the calendar",
    example: "null",
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "Calender Id",
    example: "null",
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  calendarId: string;

  @ApiProperty({
    description:
      "Value should be all || socialLinks || saleType || team || artGallery",
    example: "all",
    enum: ["all", "socialLinks", "saleType", "team", "artGallery"],
  })
  @IsNotEmpty()
  @IsEnum(querydata, {
    message:
      "Value should be all || socialLinks || saleType || team || artGallery", //i18nValidationMessage('validation.', { message: 'Not good ' }),
  })
  detail: querydata;
}

class tag {
  @ApiProperty({
    description: "Add Name",
    example: "null",
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({
    description: "Calender Id",
    example: "null",
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  calendarId: string;
}

export class addtags {
  @ApiProperty({
    description: "Calender Id",
    example: "null",
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  calendarId: string;

  @ApiProperty({
    description: "List of Tags",
    type: [tag],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => tag)
  tags: tag[];
}
