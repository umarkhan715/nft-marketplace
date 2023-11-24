import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class calendarSocialLinks {
  @ApiProperty({
    description: "Calendar Id",
    example: "null",
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  calendarId: string;

  @ApiProperty({
    description: "Website URL",
    example: "https://ncutechnologies.com/",
  })
  @IsNotEmpty()
  @IsString()
  website: string;

  @ApiProperty({
    description: "Discord URL",
    example: "https://discord.com/",
  })
  @IsNotEmpty()
  @IsString()
  discord: string;

  @ApiProperty({
    description: "Twitter URL",
    example: "https://twitter.com/",
  })
  @IsNotEmpty()
  @IsString()
  twitter: string;

  @ApiProperty({
    description: "Etherscan URL",
    example: "https://www.quicknode.com/login",
  })
  @IsNotEmpty()
  @IsString()
  etherscan: string;

  @ApiProperty({
    description: "socail Link Id",
    example: "null",
  })
  @IsNotEmpty()
  id: string | null;
}
