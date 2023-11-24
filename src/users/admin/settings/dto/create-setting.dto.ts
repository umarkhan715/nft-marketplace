import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class SettingFAQsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  settingCategoryId: string;

  @ApiProperty()
  Id: string | null;
}
export class UpdateSettingFAQsDto extends PartialType(SettingFAQsDto) {}

export class SettingCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  Id: string | null;
}

export class UpdateSettingCategoryDto extends PartialType(SettingCategoryDto) {}

//
export class SubscriptionDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  subscription: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  Id: string | null;
}

export class UpdateSubscriptionDto extends PartialType(SubscriptionDto) {}
