import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";

@ApiTags("Admin Dashboard")
@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("/")
  Dashboardfilter() {
    return this.dashboardService.Dashboard();
  }
}
