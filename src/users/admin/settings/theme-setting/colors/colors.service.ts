import { Injectable } from "@nestjs/common";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";
import { ConfigService } from "@nestjs/config";
import { DbConnectionService } from "../../../../../db-connection/db-connection.service";
@Injectable()
export class ColorsService {
  constructor(private db: DbConnectionService, private config: ConfigService) {}

  async create(dto: CreateColorDto) {
    console.log(dto);
    const data = await this.db.themeSettingcolor.upsert({
      create: { theme: dto.theme, type: dto.type, color: dto.color },
      update: { theme: dto.theme, type: dto.type, color: dto.color },
      where: { id: dto.id },
    });
    return "This action adds a new color";
  }

  async remove(id: string) {
    const findCheck = await this.db.themeSettingcolor.findUnique({
      where: { id: id },
    });
    if (findCheck) {
      await this.db.themeSettingcolor.delete({ where: { id: id } });
      return true;
    } else {
      return false;
    }
  }
}
