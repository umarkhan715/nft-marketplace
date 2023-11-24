import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CalendarFeedBackDto {
  @ApiProperty({
    type: String,
    description: "Feedback username",
  })
  @IsNotEmpty()
  @IsString()
  feedback_username: string;

  @ApiProperty({
    type: String,
    description: "Feedback User Email",
  })
  @IsNotEmpty()
  @IsString()
  feedback_email: string;

  @ApiProperty({
    type: String,
    description: "Feedback Content Email",
  })
  @IsNotEmpty()
  @IsString()
  feedback_content: string;

  @ApiProperty({
    type: String,
    description: "Id of the calendar",
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  calenderId: string;
}
