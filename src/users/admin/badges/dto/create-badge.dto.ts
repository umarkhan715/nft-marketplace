import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateBadgeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class AssignBadgeDto {
  @IsUUID()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  badgesId: string;
}

export class BadgesType {
  @IsUUID()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  badgesId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  typeName: string;
}

export class LevelDto {
  @IsUUID()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  badgesId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  levelName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  levelStart: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  levelEnd: number;
}

export class AttributesDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  startValue: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  endValue: number;
}
