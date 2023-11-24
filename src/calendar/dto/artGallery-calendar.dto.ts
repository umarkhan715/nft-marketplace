import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class artGalleryDTO {
  @ApiProperty({
    type: "array",
    name: "files",
    items: { type: "string", format: "binary" },
    description: "Art Gallery Image & can upload exactly 4 image",
  })
  files: any;

  @ApiProperty({
    type: "array",
    name: "gif",
    items: { type: "string", format: "binary" },
    description: "Calendar GIf Image & can upload exactly 1 gif",
  })
  gif: any;

  @ApiProperty({
    description: "Current user Id!!!",
    example: "null",
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: "NFT Calender Id!!!",
    example: "null",
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  calendarId: string;
}
