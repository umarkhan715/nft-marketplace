import { Injectable } from "@nestjs/common";
import { CreateSiteSettingDto } from "./dto/create-site-setting.dto";
import { UpdateSiteSettingDto } from "./dto/update-site-setting.dto";
import { DbConnectionService } from "../../../../db-connection/db-connection.service";
import { ConfigService } from "@nestjs/config";
require("dotenv").config();
@Injectable()
export class SiteSettingService {
  constructor(private db: DbConnectionService, private config: ConfigService) {}

  async create(dto: CreateSiteSettingDto, file: any) {
    let logoTemp,
      logoFlag = 0,
      bannerTemp,
      bannerFlag = 0;
    // console.log('file', file, '\n');
    if (file) {
      console.log("file exist either is banner or logo");
      if (file.banner && file.logo) {
        console.log("check executed");
        logoTemp = process.env.URL + file.logo[0].path;
        bannerTemp = process.env.URL + file.banner[0].path;
        await this.db.siteSetting.upsert({
          create: {
            logo: logoTemp,
            banner: bannerTemp,
            keywords: dto.keywords,
            description: dto.description,
            title: dto.title,
          },
          update: {
            logo: logoTemp,
            banner: bannerTemp,
            keywords: dto.keywords,
            description: dto.description,
            title: dto.title,
          },
          where: { id: dto.id },
        });
        return "success";
      }
    }
    if (dto.banner && dto.logo) {
      console.log(" _____________ first check _________________________");
      logoTemp = dto.logo;
      bannerTemp = dto.banner;
    } else if (dto.logo || dto.banner) {
      console.log(" _____________ second check _________________________");
      try {
        console.log(
          " _____________ try check _________________________",
          file.logo
        );

        if (file.logo) {
          console.log("inside if check");
          bannerTemp = dto.banner;
          logoTemp = process.env.URL + file.logo[0].path;
        } else {
          logoTemp = dto.logo;
          bannerTemp = process.env.URL + file.banner[0].path;
          console.log("inside if else check");
        }
      } catch (err) {
        // console.log(
        //   ' _____________ failed catch check _________________________',
        // );
        // logoTemp = dto.logo;
        // bannerTemp = file.banner[0].path;
      }
    }
    await this.db.siteSetting.upsert({
      create: {
        logo: logoTemp,
        banner: bannerTemp,
        keywords: dto.keywords,
        description: dto.description,
        title: dto.title,
      },
      update: {
        logo: logoTemp,
        banner: bannerTemp,
        keywords: dto.keywords,
        description: dto.description,
        title: dto.title,
      },
      where: { id: dto.id },
    });
    console.log("completed");
    return "This action adds a new siteSetting";
  }
}
