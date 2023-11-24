import { Injectable } from "@nestjs/common";
import { CreateToolDto } from "./dto/create-tool.dto";
import { UpdateToolDto } from "./dto/update-tool.dto";
import { DbConnectionService } from "../../../../db-connection/db-connection.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ToolsService {
  constructor(private db: DbConnectionService, private config: ConfigService) {}

  async create(dto: CreateToolDto) {
    await this.db.toolSetting.upsert({
      create: { toolName: dto.toolName, status: dto.status },
      update: { toolName: dto.toolName, status: dto.status },
      where: { id: dto.id },
    });
    return "This action adds a new tool";
  }

  async remove(id: string) {
    const findCheck = await this.db.toolSetting.findUnique({
      where: { id: id },
    });
    if (findCheck) {
      await this.db.toolSetting.delete({ where: { id: id } });
      return true;
    } else {
      return false;
    }
  }
}
