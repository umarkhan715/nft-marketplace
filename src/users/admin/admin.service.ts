import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { Adminlogindto, CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async returnroleidonrolebase(role: string) {
    let getUserRole = await this.prisma.role.findUnique({
      where: {
        name: role,
      },
    });

    switch (role) {
      case "Moderator":
        return getUserRole.id;
      case "Admin":
        return getUserRole.id;
      default:
        break;
    }
  }
  async signToken(
    userId: string,
    email: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };
    const secret = this.config.get("JWT_SECRET");
    const refreshsecret = this.config.get("REFRESH_SECRET");
    const accesstoken = await this.jwt.signAsync(payload, {
      expiresIn: "30m",
      secret: secret,
    });
    const refreshtoken = await this.jwt.signAsync(payload, {
      expiresIn: "1d",
      secret: refreshsecret,
    });

    return {
      access_token: accesstoken,
      refresh_token: refreshtoken,
    };
  }

  async createCredentails(
    createCredentailsDto: CreateAdminDto,
    response: Response
  ) {
    try {
      const hash = bcrypt.hashSync(createCredentailsDto.password, 5);

      let isCreated = await this.prisma.credentails.create({
        data: {
          email: createCredentailsDto.email,
          password: hash,
          phoneNumber: createCredentailsDto.phoneNumber,
          roleId: await this.returnroleidonrolebase(createCredentailsDto.Role),
        },
      });
      if (isCreated) {
        delete isCreated.password;
        response.status(HttpStatus.OK).json({
          data: isCreated,
          message: "Successfully created",
        });
      } else {
        throw new HttpException("Cannot Create", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async adminlogin(adminlogindto: Adminlogindto, response: Response) {
    try {
      let isUserExist = await this.prisma.credentails.findUnique({
        where: {
          email: adminlogindto.email,
        },
        include: {
          role: true,
        },
      });
      if (isUserExist) {
        const controls = await this.prisma.permissions.findMany({
          where: {
            moderatorId: isUserExist.id,
          },
          include: {
            control: true,
          },
        });

        let controlsArr = controls.map((control) => {
          console.log(control);

          return { title: control.control.title, route: control.control.route };
        });
        const isvalid = bcrypt.compareSync(
          adminlogindto.password,
          isUserExist.password
        );
        if (isvalid) {
          delete isUserExist.password;
          let tokens = await this.signToken(isUserExist.id, isUserExist.email);
          response.status(HttpStatus.OK).json({
            token: tokens,
            user: isUserExist,
            controls: controlsArr,
          });
        } else {
          throw new HttpException(
            "Password not valid!!",
            HttpStatus.BAD_REQUEST
          );
        }
      } else {
        throw new HttpException("Cannot Create", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getallCredentails(response: Response) {
    try {
      let credentailsExist = await this.prisma.credentails.findMany({
        include: {
          role: true,
          permissions: {
            include: {
              control: true,
            },
          },
        },
      });
      if (credentailsExist) {
        response.status(HttpStatus.OK).json(credentailsExist);
      } else {
        throw new HttpException("Not Found!!", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getallmoderator(response: Response) {
    try {
      let moderatorCredentails = await this.prisma.credentails.findMany({
        where: {
          role: {
            name: "Moderator",
          },
        },

        select: {
          id: true,
          email: true,
          phoneNumber: true,
          roleId: true,
          permissions: {
            include: {
              control: true,
            },
          },
        },
      });
      if (moderatorCredentails) {
        response.status(HttpStatus.OK).json(moderatorCredentails);
      } else {
        throw new HttpException("Not Found!!", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deleteCredentails(id: string, response: Response) {
    try {
      let isDeleted = await this.prisma.credentails.delete({
        where: {
          id: id,
        },
        select: {
          id: true,
          email: true,
          phoneNumber: true,
        },
      });
      if (isDeleted) {
        response.status(HttpStatus.OK).json(isDeleted);
      } else {
        throw new HttpException("Not Found!!", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
