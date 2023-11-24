import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class teamCalendar {
  @ApiProperty({
    description: "Calendar Team Id",
    example: "null",
  })
  @IsOptional()
  @IsString()
  id: string | null;

  @ApiProperty({
    description: "Name of Team Member",
    example: "John Smith",
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: "role of Team Member",
    example: "Developer",
  })
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty({
    description: "Description of Team Member",
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: "SocialLinks of Team Member",
    example: "http://",
  })
  @IsOptional()
  @IsString()
  socialLink: string;

  @ApiProperty({
    description: "Twitter Link of Team Member",
    example: "http://",
  })
  @IsOptional()
  @IsString()
  twitterLink: string;

  @ApiProperty({
    description: "Discord Link of Team Member",
    example: "http://",
  })
  @IsOptional()
  @IsString()
  discordLink: string;

  @ApiProperty({
    description: "LinkedIn Link of Team Member",
    example: "http://",
  })
  @IsOptional()
  @IsString()
  LinkedInLink: string;

  @ApiProperty({
    description: "Calendar Id",
  })
  @IsNotEmpty()
  @IsString()
  calendarId: string;

  @ApiProperty({
    description: "Is Team Member Exist",
    example: "null",
  })
  @IsOptional()
  @IsString()
  isExits: string | null;
}
