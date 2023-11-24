import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CalendarLikeDto {
  @ApiProperty({
    type: String,
    description: "Id of the user",
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    type: String,
    description: "Id of the calendar",
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  calenderId: string;
}
