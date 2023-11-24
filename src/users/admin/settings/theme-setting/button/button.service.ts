import { Injectable } from "@nestjs/common";
import { CreateButtonDto } from "./dto/create-button.dto";
import { UpdateButtonDto } from "./dto/update-button.dto";
import { ConfigService } from "@nestjs/config";
import { DbConnectionService } from "../../../../../db-connection/db-connection.service";
@Injectable()
export class ButtonService {
  constructor(private db: DbConnectionService, private config: ConfigService) {}

  async create(dto: CreateButtonDto) {
    await this.db.themeSettingButton.upsert({
      create: {
        theme: dto.theme,
        type: dto.buttonType,
        fontSize: dto.fontsize,
        fontStyle: dto.fontStyle,
        color: dto.color,
        backgroundColor: dto.backgroundColor,
        margin: dto.margin,
        padding: dto.padding,
        borderRadius: dto.borderRadius,
        shadow: dto.shadow,
      },
      update: {
        theme: dto.theme,
        type: dto.buttonType,
        fontSize: dto.fontsize,
        fontStyle: dto.fontStyle,
        color: dto.color,
        backgroundColor: dto.backgroundColor,
        margin: dto.margin,
        padding: dto.padding,
        borderRadius: dto.borderRadius,
        shadow: dto.shadow,
      },
      where: { id: dto.id },
    });
    return "This action adds a new button";
  }

  async remove(id: string) {
    const findCheck = await this.db.themeSettingButton.findUnique({
      where: { id: id },
    });
    if (findCheck) {
      await this.db.themeSettingButton.delete({ where: { id: id } });
      return true;
    } else {
      return false;
    }
  }
}
