import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password too weak",
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  Role: string;
}

export class Adminlogindto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
