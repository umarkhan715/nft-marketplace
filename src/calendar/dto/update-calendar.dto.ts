import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { updateString } from "./updateString.dto";

export class UpdateCalendarDto {
  @ApiProperty({
    description: "Update the Calendar",
    type: [updateString],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => updateString)
  data: updateString[];
}
