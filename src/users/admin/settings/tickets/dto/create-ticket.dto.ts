import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ticketUrl: string | null;

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
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  SettingTicketTypeId: string;
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}

export class CreateTicketTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ticketName: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
export class UpdateTicketTypeDto extends PartialType(CreateTicketTypeDto) {}
