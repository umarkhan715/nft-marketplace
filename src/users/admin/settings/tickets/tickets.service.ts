import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendgridService } from "src/EmailService/sendGrid.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTicketDto, CreateTicketTypeDto } from "./dto/create-ticket.dto";
import { Response } from "express";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
@Injectable()
export class TicketsService {
  constructor(
    private db: PrismaService,
    private config: ConfigService,
    private readonly sendgridService: SendgridService
  ) {}

  async addticket(
    createTicketDto: CreateTicketDto,
    file: Express.Multer.File,
    response: Response
  ) {
    try {
      let imageData: any = file;
      const { ticketImage } = imageData;
      let ticketUrl: string = "";
      if (imageData.ticketImage) {
        ticketUrl = `${this.config.get("DEPLOY_URL")}/${ticketImage[0].path}`;
      } else {
        ticketUrl = createTicketDto.ticketUrl;
      }

      let ticket = await this.db.settingTicket.upsert({
        where: { id: createTicketDto.id },
        create: {
          title: createTicketDto.title,
          description: createTicketDto.description,
          email: createTicketDto.email,
          ticketImage: ticketUrl,
          SettingTicketTypeId: createTicketDto.SettingTicketTypeId,
        },
        update: {
          title: createTicketDto.title,
          description: createTicketDto.description,
          email: createTicketDto.email,
          ticketImage: ticketUrl,
          SettingTicketTypeId: createTicketDto.SettingTicketTypeId,
        },
      });
      if (ticket) {
        console.log(ticket);
        return response.status(200).json(ticket);
      } else {
        throw new HttpException(
          "something went Wrong!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findAllTicket(response: Response) {
    try {
      let isFound = await this.db.settingTicket.findMany({});
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("Record not found!! ", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findsingleticket(ticketId: string, response: Response) {
    try {
      let isFound = await this.db.settingTicket.findUnique({
        where: {
          id: ticketId,
        },
      });
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("Record not found!! ", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deleteticket(ticketId: string, response: Response) {
    try {
      let isFound = await this.db.settingTicket.delete({
        where: {
          id: ticketId,
        },
      });
      if (isFound) {
        return response.status(204).json(isFound);
      } else {
        throw new HttpException("Record not found!! ", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  // add ticket type
  async addticketType(dto: CreateTicketTypeDto, response: Response) {
    try {
      let IsCreated = await this.db.settingTicketType.upsert({
        where: { id: dto.id },
        create: {
          ticketName: dto.ticketName,
          description: dto.description,
        },
        update: {
          ticketName: dto.ticketName,
          description: dto.description,
        },
      });

      if (IsCreated) {
        return response.status(200).json(IsCreated);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findAllTicketType(response: Response) {
    try {
      let isFound = await this.db.settingTicketType.findMany({});
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("Record not found!! ", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findsingleTicketType(ticketTypeId: string, response: Response) {
    try {
      let isFound = await this.db.settingTicketType.findUnique({
        where: {
          id: ticketTypeId,
        },
      });
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("Record not found!! ", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deleteticketType(ticketTypeId: string, response: Response) {
    try {
      let isFound = await this.db.settingTicketType.delete({
        where: {
          id: ticketTypeId,
        },
      });
      if (isFound) {
        return response.status(204).json(isFound);
      } else {
        throw new HttpException("Record not found!! ", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
