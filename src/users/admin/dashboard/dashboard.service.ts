import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
const Web3 = require("web3");
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly db: PrismaService,
    private config: ConfigService
  ) {}

  async Dashboard() {
    return "dashboard";
  }
}
