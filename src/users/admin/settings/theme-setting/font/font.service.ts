import { Injectable } from "@nestjs/common";
import { CreateFontDto } from "./dto/create-font.dto";
import { UpdateFontDto } from "./dto/update-font.dto";
import { DbConnectionService } from "../../../../../db-connection/db-connection.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FontService {
  constructor(private db: DbConnectionService, private config: ConfigService) {}

  async create(dto: CreateFontDto) {
    await this.db.themeSettingFont.upsert({
      create: {
        h1: dto.h1,
        h2: dto.h2,
        h3: dto.h3,
        h4: dto.h4,
        h5: dto.h5,
        h6: dto.h6,
        span: dto.span,
        googleFont: dto.googleFont,
      },
      update: {
        h1: dto.h1,
        h2: dto.h2,
        h3: dto.h3,
        h4: dto.h4,
        h5: dto.h5,
        h6: dto.h6,
        span: dto.span,
        googleFont: dto.googleFont,
      },
      where: { id: dto.id },
    });
    return "This action adds a new font";
  }

  async remove(id: string) {
    const findCheck = await this.db.themeSettingFont.findUnique({
      where: { id: id },
    });
    if (findCheck) {
      await this.db.themeSettingFont.delete({ where: { id: id } });
      return true;
    } else {
      return false;
    }
  }
}
