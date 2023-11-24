import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
  ValidateNested,
} from "class-validator";

class faq {
  @ApiProperty({
    description: "Calendar faq Id",
    example: "null",
  })
  @IsOptional()
  id: string | null;

  @ApiProperty({
    description: "Faq Questions",
    example: "What is NFT",
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description: "Faq Answer",
    example:
      "What is NFT stands for Non-fungible token. A digital artifact that reflects real-world assets such as art, music, in-game goods, and videos is known as an NFT.",
  })
  @IsNotEmpty()
  @IsString()
  answer: string;
}
class roadmap {
  @ApiProperty({
    description: "Calendar roadmap Id",
    example: "null",
  })
  @IsOptional()
  id: string | null;

  @ApiProperty({
    description: "Calendar RoadMAP title",
    example: "test title",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Calendar RoadMAP Description",
    example: "test content",
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class overviewCalendar {
  @ApiProperty({
    description: "OverView Calendar introduction",
  })
  @IsString()
  @IsNotEmpty()
  introduction: string;

  @ApiProperty({
    description: "List of Faqs",
    type: [faq],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => faq)
  FAQ: faq[];

  @ApiProperty({
    description: "List of RoadMAPs",
    type: [roadmap],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => roadmap)
  roadmap: roadmap[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "Calendar Id",
    example: "null",
  })
  calendarId: string;

  @ApiProperty({
    description: "Calendar Launch Date",
    example: `${Date.now()}`,
  })
  @IsOptional()
  @IsDate()
  launchDate: Date;

  @ApiProperty({
    description: "User ID that own the Calendar",
    example: "null",
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;
}
