import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import {
  CreateBadgeDto,
  LevelDto,
  AssignBadgeDto,
  AttributesDto,
} from "./dto/create-badge.dto";
import { UpdateBadgeDto, UpdateLevelDto } from "./dto/update-badge.dto";

@Injectable()
export class BadgesService {
  constructor(private db: PrismaService) {}

  async createbadges(createBadgeDto: CreateBadgeDto, response: Response) {
    try {
      let isCreated = await this.db.badges.create({
        data: createBadgeDto,
      });

      if (isCreated) {
        return response.status(201).json(isCreated);
      } else {
        throw new HttpException(
          "something went wroung!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async assignbadgetoUser(AssignBadgeDto: AssignBadgeDto, response: Response) {
    try {
      let isCreated = await this.db.userBadges.create({
        data: AssignBadgeDto,
      });

      if (isCreated) {
        return response.status(201).json(isCreated);
      } else {
        throw new HttpException(
          "something went wroung!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async createlevel(levelDto: LevelDto, response: Response) {
    try {
      let isCreated = await this.db.level.create({
        data: levelDto,
      });

      if (isCreated) {
        return response.status(201).json(isCreated);
      } else {
        throw new HttpException(
          "something went wroung!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findallbadges(response: Response) {
    try {
      let IsFound = await this.db.badges.findMany({
        include: {
          level: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      if (IsFound) {
        return response.status(200).json(IsFound);
      } else {
        throw new HttpException("Record Not found!!", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findsinglebadge(badgeId: string, response: Response) {
    try {
      let isFound = await this.db.badges.findUnique({
        where: {
          id: badgeId,
        },
        include: {
          level: true,
        },
      });

      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("Record Not found!!", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deletebadges(badgeId: string, response: Response) {
    try {
      let isDeleted = await this.db.badges.delete({
        where: {
          id: badgeId,
        },
      });
      console.log(isDeleted);
      if (isDeleted) {
        return response.status(204).json(isDeleted);
      } else {
        throw new HttpException(
          `Could not delete ${badgeId}`,
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deletelevel(levelId: string, response: Response) {
    try {
      let isDeleted = await this.db.level.delete({
        where: {
          id: levelId,
        },
      });
      if (isDeleted) {
        return response.status(202).json(isDeleted);
      } else {
        throw new HttpException(
          "Could not delete #${badgeId}",
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async updateLevel(
    levelId: string,
    levelDto: UpdateLevelDto,
    response: Response
  ) {
    try {
      let isUpdated = await this.db.level.update({
        where: {
          id: levelId,
        },
        data: levelDto,
      });
      if (isUpdated) {
        return response.status(200).json(isUpdated);
      } else {
        throw new HttpException(
          "Could not delete #${badgeId}",
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async updatebadges(
    badgeId: string,
    updateBadgeDto: UpdateBadgeDto,
    response: Response
  ) {
    try {
      let isUpdated = await this.db.badges.update({
        where: {
          id: badgeId,
        },
        data: updateBadgeDto,
      });
      if (isUpdated) {
        return response.status(200).json(isUpdated);
      } else {
        throw new HttpException(`${badgeId} not found`, HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  // attributes routes
  async createattribute(dto: AttributesDto, response: Response) {
    try {
      let isCreated = await this.db.attribute.upsert({
        where: { id: dto.id },
        create: {
          color: dto.color,
          startValue: dto.startValue,
          endValue: dto.endValue,
        },
        update: {
          color: dto.color,
          startValue: dto.startValue,
          endValue: dto.endValue,
        },
      });
      if (isCreated) {
        return response.status(200).json(isCreated);
      } else {
        throw new HttpException(
          "Something Went Wroung!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deletelattribute(attritubeId: string, response: Response) {
    try {
      let isDeleted = await this.db.attribute.delete({
        where: {
          id: attritubeId,
        },
      });
      if (isDeleted) {
        return response.status(204).json(isDeleted);
      } else {
        throw new HttpException(
          "Could not delete #${badgeId}",
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findallattribute(response: Response) {
    try {
      let IsFound = await this.db.attribute.findMany({
        orderBy: {
          created_at: "desc",
        },
      });

      if (IsFound) {
        return response.status(200).json(IsFound);
      } else {
        throw new HttpException("Record Not found!!", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findsingleattribute(attributeId: string, response: Response) {
    try {
      let isFound = await this.db.attribute.findUnique({
        where: {
          id: attributeId,
        },
      });

      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("Record Not found!!", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
