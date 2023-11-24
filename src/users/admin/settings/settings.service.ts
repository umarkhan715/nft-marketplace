import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import {
  SettingCategoryDto,
  SettingFAQsDto,
  SubscriptionDto,
} from "./dto/create-setting.dto";

@Injectable()
export class SettingsService {
  constructor(private db: PrismaService) {}
  // faqs services
  async createfaqs(FAQsDto: SettingFAQsDto, response: Response) {
    try {
      let isCreated = await this.db.settingFAQs.upsert({
        where: {
          id: FAQsDto.Id,
        },
        create: {
          title: FAQsDto.title,
          description: FAQsDto.description,
          settingCategoryId: FAQsDto.settingCategoryId,
        },
        update: {
          title: FAQsDto.title,
          description: FAQsDto.description,
          settingCategoryId: FAQsDto.settingCategoryId,
        },
      });
      if (isCreated) {
        return response.status(200).json(isCreated);
      } else {
        throw new HttpException(
          "something went wrong!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findAllFAQs(response: Response) {
    try {
      let faqs = await this.db.settingFAQs.findMany({});
      if (faqs) {
        return response.status(200).json(faqs);
      } else {
        throw new HttpException("Record not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findsinglefaqs(faqsId: string, response: Response) {
    try {
      let faqs = await this.db.settingFAQs.findMany({
        where: {
          id: faqsId,
        },
      });
      if (faqs) {
        return response.status(200).json(faqs);
      } else {
        throw new HttpException("Record not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deleteFAQs(faqId: string, response: Response) {
    try {
      let isDeleted = await this.db.settingFAQs.delete({
        where: {
          id: faqId,
        },
      });
      if (isDeleted) {
        return response.status(200).json(isDeleted);
      } else {
        throw new HttpException("Record not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  // faqs
  async createcategory(
    settingCategoryDto: SettingCategoryDto,
    response: Response
  ) {
    try {
      let isCreated = await this.db.settingCategory.upsert({
        where: { id: settingCategoryDto.Id },
        create: {
          description: settingCategoryDto.description,
          categoryName: settingCategoryDto.categoryName,
        },
        update: {
          description: settingCategoryDto.description,
          categoryName: settingCategoryDto.categoryName,
        },
      });
      if (isCreated) {
        return response.status(200).json(isCreated);
      } else {
        throw new HttpException(
          "something went wrong!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findAllCategory(response: Response) {
    try {
      let faqs = await this.db.settingCategory.findMany({
        include: {
          FAQs: true,
        },
      });
      if (faqs) {
        return response.status(200).json(faqs);
      } else {
        throw new HttpException("Record not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findsinglecategory(categoryId: string, response: Response) {
    try {
      let faqs = await this.db.settingCategory.findMany({
        where: {
          id: categoryId,
        },
        include: {
          FAQs: true,
        },
      });
      if (faqs) {
        return response.status(200).json(faqs);
      } else {
        throw new HttpException("Record not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deletecategory(categoryId: string, response: Response) {
    try {
      let isDeleted = await this.db.settingCategory.delete({
        where: {
          id: categoryId,
        },
      });
      if (isDeleted) {
        return response.status(200).json(isDeleted);
      } else {
        throw new HttpException("Record not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  // subscription services

  async Subscription(dto: SubscriptionDto, response: Response) {
    try {
      let isCreated = await this.db.subscription.upsert({
        where: {
          id: dto.Id,
        },
        create: {
          subscription: dto.subscription,
          userId: dto.userId,
        },
        update: {
          subscription: dto.subscription,
        },
      });
      if (isCreated) {
        return response.status(200).json(isCreated);
      } else {
        throw new HttpException(
          "something went wrong!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  async getAllSite(response: Response) {
    try {
      let arr = [];
      arr.push(await this.db.themeSettingButton.findMany({}));
      arr.push(await this.db.themeSettingFont.findMany({}));
      arr.push(await this.db.themeSettingcolor.findMany({}));
      arr.push(await this.db.siteSetting.findMany({}));
      arr.push(await this.db.toolSetting.findMany({}));

      if (arr) {
        return response.status(200).json(arr);
      } else {
        throw new HttpException(
          "something went wrong!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
