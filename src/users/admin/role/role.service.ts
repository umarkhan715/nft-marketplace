import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  AddModeratorDto,
  AddModeratorWithEmailDto,
  CreateRoleDto,
  updateModeratorControls,
} from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Response } from "express";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import bcrypt from "bcrypt";
import { SendgridService } from "src/EmailService/sendGrid.service";
import console from "console";

@Injectable()
export class RoleService {
  constructor(
    private db: PrismaService,
    private emailService: SendgridService
  ) {}

  async createRole(createRoleDto: CreateRoleDto, response: Response) {
    console.log(createRoleDto);
    try {
      let iscreated = await this.db.role.create({
        data: {
          name: createRoleDto.name,
        },
      });
      if (iscreated) {
        return response.status(201).json(iscreated);
      } else {
        throw new HttpException("something went wrong", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findAllRole(response: Response) {
    try {
      let isFound = await this.db.role.findMany({});
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("No Record Found!!", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findsinglerole(roleid: string, response: Response) {
    try {
      let isFound = await this.db.role.findUnique({
        where: {
          id: roleid,
        },
      });
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("No Record Found!!", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async updaterole(
    roleid: string,
    updateRoleDto: UpdateRoleDto,
    response: Response
  ) {
    try {
      let isFound = await this.db.role.update({
        where: {
          id: roleid,
        },
        data: {
          name: updateRoleDto.name,
        },
      });
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException(
          "No Record Found to Update!!",
          HttpStatus.NO_CONTENT
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deleteRole(roleid: string, response: Response) {
    try {
      let isFound = await this.db.role.delete({
        where: {
          id: roleid,
        },
      });
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException(
          "No Record Found to Delete!!",
          HttpStatus.NO_CONTENT
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async addModerator(dto: AddModeratorDto, response: Response) {
    try {
      let isUserExit = await this.db.wallet.findUnique({
        where: {
          walletAddress: dto.walletAddress,
        },
        include: {
          user: true,
        },
      });
      if (isUserExit) {
        let isModeratorAdd = await this.db.user.update({
          where: {
            id: isUserExit.user.id,
          },
          data: {
            roleId: dto.roleId,
          },
        });

        if (isModeratorAdd) {
          return response.status(200).json({
            success: true,
            code: 200,
          });
        } else {
          throw new HttpException(
            "something went wrong",
            HttpStatus.BAD_REQUEST
          );
        }
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getAllUserRole(response: Response) {
    try {
      let isFound = await this.db.user.findMany({
        where: {
          NOT: {
            roleId: null,
          },
        },
        select: {
          username: true,
          role: true,
          roleId: true,
          wallets: true,
        },
      });
      console.log(isFound);
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("No Record Found!!", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getuserbyroleid(roleIdtofind: string, response: Response) {
    try {
      let isFound = await this.db.user.findMany({
        where: {
          roleId: roleIdtofind,
        },
        select: {
          username: true,
          role: true,
          roleId: true,
          wallets: true,
        },
      });
      console.log(isFound);
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("No Record Found!!", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async removeRole(walletAddresstoFind: string, response: Response) {
    try {
      let validwallets = await this.db.wallet.findUnique({
        where: {
          walletAddress: walletAddresstoFind,
        },
        include: {
          user: true,
        },
      });
      if (validwallets) {
        let isRemoved = await this.db.user.update({
          where: { id: validwallets.user.id },
          data: {
            roleId: null,
          },
        });
        if (isRemoved) {
          return response.status(200).json({
            success: true,
            code: 200,
          });
        }
      } else {
        throw new HttpException(
          "No Record Found to Delete!!",
          HttpStatus.NO_CONTENT
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async addModeratorWithEmail(
    dto: AddModeratorWithEmailDto,
    response: Response
  ) {
    try {
      const hash: string = bcrypt.hashSync(dto.password, 5);
      const userAdded = await this.db.credentails.create({
        data: {
          email: dto.emailAddress,
          password: hash,
          roleId: dto.roleId,
        },
      });
      if (userAdded) {
        dto.controls.forEach(async (element) => {
          await this.db.permissions.create({
            data: {
              title: element.title,
              controlId: element.id,
              moderatorId: userAdded.id,
            },
          });
        });

        const body = `<h1>Your password is ${dto.password}</h1>`;
        await this.emailService.sendEmailWithBody(dto.emailAddress, body);
        return response.status(200).json({
          success: true,
          code: 200,
        });
      } else {
        throw new HttpException("Bad Request!!", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getallControl(response: Response) {
    try {
      let controlList = await this.db.controls.findMany({
        select: {
          id: true,
          title: true,
          route: true,
        },
      });
      if (controlList) {
        return response.json(controlList);
      } else {
        throw new HttpException("Not Found!!", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async updateModeratorControls(
    dto: updateModeratorControls,
    response: Response
  ) {
    try {
      console.log("in update control");
      await this.db.permissions.deleteMany({
        where: { moderatorId: dto.id },
      });
      console.log("deleted old control");
      dto.controls.forEach(async (element) => {
        await this.db.permissions.create({
          data: {
            title: element.title,
            controlId: element.id,
            moderatorId: dto.id,
          },
        });
      });
      console.log("added new control");
      if (dto.password && dto.emailAddress) {
        const hash: string = bcrypt.hashSync(dto.password, 5);
        console.log("Updating password!!!");
        await this.db.credentails.update({
          where: {
            id: dto.id,
          },
          data: {
            password: hash,
          },
        });
        const body = `<h1>Your password is ${dto.password}</h1>`;
        await this.emailService.sendEmailWithBody(dto.emailAddress, body);
      }

      return response.status(200).json({
        success: true,
        code: 200,
      });
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
