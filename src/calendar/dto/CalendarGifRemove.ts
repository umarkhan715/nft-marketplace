import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CalendarRemoveGifDto {
  @ApiProperty({
    type: String,
    description: "Id of the calendar",
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  calenderId: string;
}
