import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { DashboardModule } from "./dashboard/dashboard.module";
import { BadgesModule } from "./badges/badges.module";
import { SettingsModule } from "./settings/settings.module";
import { RoleModule } from "./role/role.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [AdminController],
  providers: [AdminService, JwtService],
  imports: [DashboardModule, BadgesModule, SettingsModule, RoleModule],
})
export class AdminModule {}
