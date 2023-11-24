import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { SendgridService } from "src/EmailService/sendGrid.service";

@Module({
  controllers: [RoleController],
  providers: [RoleService, SendgridService],
})
export class RoleModule {}
