import {
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class FAQvalidate {
  @ApiProperty({
    description: "Add Question",
    example: "null",
  })
  @IsString()
  @IsOptional()
  question: string;

  @ApiProperty({
    description: "Add Answer",
    example: "null",
  })
  @IsString()
  @IsOptional()
  answer: string;
}
class roadmapValidate {
  @ApiProperty({
    description: "Add title",
    example: "null",
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: "Add Content",
    example: "null",
  })
  @IsString()
  @IsOptional()
  content: string;
}
class teamvalidate {
  @ApiProperty({
    description: "Add Name",
    example: "null",
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: "Add Description",
    example: "null",
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: "Add Role",
    example: "null",
  })
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty({
    description: "Add SocialLinks",
    example: "null",
  })
  @IsString()
  @IsOptional()
  socialLink: string;
}
class galleryValidate {
  @ApiProperty({
    description: "Add image URL",
  })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    description: "Add Gif URL",
  })
  @IsString()
  @IsOptional()
  gif: string;
}
class socialLinkValidate {
  @ApiProperty({
    description: "Add Link",
    example: "null",
  })
  @IsString()
  @IsOptional()
  link: string;

  @ApiProperty({
    description: "Add Type",
    example: "null",
  })
  @IsString()
  @IsOptional()
  type: string;
}
export class updateString {
  @ApiProperty({
    description: "Calendar Title",
    example: "test title",
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: "Add Description",
    example: "null",
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: "blockchain should be solana || ethereum",
    enum: ["ethereum", "solana"],
    example: "ethereum",
  })
  @IsOptional()
  @IsString()
  blockchainTypeId: string;

  @ApiProperty({
    description: "Add Image",
  })
  @IsOptional()
  @IsString()
  banner: string;

  @ApiProperty({
    description: "Add Profile Image",
  })
  @IsString()
  @IsOptional()
  profileImage: string;

  @ApiProperty({
    description: "Add Category",
    example: "null",
  })
  @IsOptional()
  @IsString()
  category: string;

  @ApiProperty({
    description: "Calendar Id",
    example: "null",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  calendarId: string;
  //overview
  @ApiProperty({
    description: "Add OverView",
    example: null,
  })
  @IsOptional()
  @IsString()
  overview: string;

  @ApiProperty({
    description: "Add Faqs About Calendar",
    type: [FAQvalidate],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FAQvalidate)
  FAQ: FAQvalidate[];

  @ApiProperty({
    description: "Add roadMap to Calendar",
    type: [roadmapValidate],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => roadmapValidate)
  roadmap: roadmapValidate[];

  @ApiProperty({
    description: "Add Team Member to Calendar",
    type: [teamvalidate],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => teamvalidate)
  teams: teamvalidate[];

  @ApiProperty({
    description: "Add Art Gallery to Calendar",
    type: [galleryValidate],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => galleryValidate)
  gallery: galleryValidate[];

  @ApiProperty({
    description: "Add SocialLink to Calendar",
    type: [socialLinkValidate],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => socialLinkValidate)
  socialLink: socialLinkValidate[];
}
