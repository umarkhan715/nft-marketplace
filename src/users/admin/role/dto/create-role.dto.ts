import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AddModeratorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  roleId: string;
}

export class ControlList {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class AddModeratorWithEmailDto {
  @ApiProperty()
  @IsOptional()
  id: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty()
  password: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @ApiProperty({ type: [ControlList] })
  @ValidateNested({ each: true })
  @Type(() => ControlList)
  controls: ControlList[];
}

export class updateModeratorControls extends PartialType(
  AddModeratorWithEmailDto
) {}
