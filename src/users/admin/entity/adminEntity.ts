import { ApiProperty } from "@nestjs/swagger";
import { Credentails, Role } from "@prisma/client";

export class role implements Role {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() active: boolean;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
}

export class AdminEntity implements Credentails {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() phoneNumber: string;
  @ApiProperty() password: string;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() roleId: string;
  @ApiProperty() role: role;
}

export class token {
  @ApiProperty() access_token: string;
  @ApiProperty() refresh_token: string;
}

export class AdminCredentailEntity {
  @ApiProperty() token: token;
  @ApiProperty() user: AdminEntity;
}
