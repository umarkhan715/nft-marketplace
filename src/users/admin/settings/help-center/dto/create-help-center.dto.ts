import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { type } from 'os';
export class CreateHelpCenterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  Name: string;

  @ApiProperty()
  ParentId: string | null;

  @ApiProperty()
  dropdownid: string | null;

  @ApiProperty()
  Id: string | null;
}
export class UpdateHelpCenterDto extends PartialType(CreateHelpCenterDto) {}

export class FormFieldDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  FiledName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  heplCenterOptionId: string;

  @ApiProperty()
  Id: string | null;
}
export class UpdateFormFieldDto extends PartialType(FormFieldDto) {}

export class DropDownDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dropdownName: string;

  @ApiProperty()
  ParentId: string | null;

  @ApiProperty({
    description: 'List of Dropdown options',
    type: [String],
  })
  options: Array<string>;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  heplCenterOptionId: string;
}
export class UpdateDropDownDto extends PartialType(DropDownDto) {}
