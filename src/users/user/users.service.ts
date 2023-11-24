import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { CreateAuthDto, SubcriptionsDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import jwt from "jsonwebtoken";
import Web3 from "web3";
const { PublicKey } = require("@solana/web3.js");
import bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { Request, Response } from "express";
import console from "console";
import { Prisma } from "@prisma/client";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";

@Injectable()
export class UsersService {
  web3: any;
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {
    this.web3 = new Web3(this.config.get("INFRA_URL"));
  }
  //====================================================================
  async create(createUserDto: CreateAuthDto, response: Response) {
    try {
      if (
        createUserDto.wallettype === "Ethereum" &&
        !this.web3.utils.isAddress(createUserDto.wallet)
      ) {
        throw new BadRequestException("Wallet Address is not Valid ");
      }

      if (
        createUserDto.wallettype === "Solana" &&
        !PublicKey.isOnCurve(new PublicKey(createUserDto.wallet))
      ) {
        throw new BadRequestException("Wallet Address is not Valid ");
      }
      let wallet = await this.prisma.wallet.findUnique({
        where: {
          walletAddress: createUserDto.wallet.toString(),
        },
        include: {
          user: true,
          WalletType: true,
        },
      });
      // not wallet NOw create wallet
      if (!wallet) {
        console.log("Creating User");
        let userRoleId = await this.prisma.role.findFirst({
          where: {
            name: "User",
          },
        });
        console.log(userRoleId);
        let walletTypeId = await this.prisma.walletType.findUnique({
          where: {
            walletType: createUserDto.wallettype,
          },
        });
        console.log(walletTypeId);
        console.log(walletTypeId.id);
        const newWallet = await this.prisma.user.create({
          data: {
            profileImage: this.config.get("profileImage"),
            coverImage: this.config.get("bannerImage"),
            username: "",
            discordlink: "",
            twitterlink: "",
            spendingAmount: 0,
            roleId: userRoleId.id,
            wallets: {
              create: {
                walletAddress: createUserDto.wallet,
                walletTypeId: walletTypeId.id,
              },
            },
          },
          include: {
            wallets: {
              include: {
                WalletType: true,
              },
            },
            role: true,
          },
        });
        console.log(newWallet);
        if (newWallet) {
          const token = await this.signToken(
            newWallet.id,
            createUserDto.wallet
          );
          return response.status(201).json({
            token,
            user: newWallet,
          });
        }
      } else {
        console.log("User Exist!!!");
        const { user } = wallet;

        const userdetail = await this.prisma.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            wallets: {
              include: {
                WalletType: true,
              },
            },
            role: true,
          },
        });

        const token = await this.signToken(wallet.userId, createUserDto.wallet);
        return response.status(200).json({
          token,
          user: userdetail,
        });
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  async signToken(
    userId: string,
    wallet: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      sub: userId,
      wallet: wallet,
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

    const hashtoken = await this.encryptrefreshtoken(refreshtoken); // refresh token hash
    await this.updaterefreshtokenindb(userId, hashtoken);

    return {
      access_token: accesstoken,
      refresh_token: refreshtoken,
    };
  }
  //====================================================================
  async getrefreshtoken(request: Request, response: Response) {
    try {
      let BearerToken = request.headers["authorization"];
      let refreshToken = BearerToken.split(" ")[1];

      const refreshsecret = this.config.get("REFRESH_SECRET");

      const isvalid = jwt.verify(refreshToken, refreshsecret);

      if (isvalid) {
        var payload = this.parseJwt(refreshToken);
        const user = await this.prisma.user.findUnique({
          where: {
            id: payload.sub,
          },
        });

        const isvalid = await this.verifyrefreshhash(
          user.refreshToken,
          refreshToken
        );

        if (isvalid) {
          return response
            .status(200)
            .json(await this.signToken(user.id, payload.wallet));
        } else {
          throw new HttpException("invalid refreshtoken", HttpStatus.FORBIDDEN);
        }
      } else {
        throw new HttpException("invalid refreshtoken", HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  parseJwt(token: string) {
    var base64Payload = token.split(".")[1];
    var payload = Buffer.from(base64Payload, "base64");
    return JSON.parse(payload.toString());
  }
  //====================================================================
  async updaterefreshtokenindb(userId: string, refreshtoken: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          refreshToken: refreshtoken,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  //====================================================================
  async encryptrefreshtoken(refreshtoken: string) {
    const hash = bcrypt.hashSync(refreshtoken, 5);
    return hash;
  }
  //====================================================================
  async verifyrefreshhash(dbToken: string, userToken: string) {
    const isvalid = bcrypt.compareSync(userToken, dbToken);
    return isvalid;
  }
  //====================================================================
  async getuserbywalletAddress(walletAddressId: string, response: Response) {
    try {
      let wallet = await this.prisma.wallet.findUnique({
        where: {
          walletAddress: walletAddressId,
        },
        select: {
          user: true,
        },
      });
      if (wallet) {
        const { user } = wallet;
        let data = await this.prisma.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            wallets: true,
          },
        });
        return response.status(200).json(data);
      } else {
        throw new HttpException("Address Not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  async updateuserprofile(
    files: Express.Multer.File,
    userDto: UpdateAuthDto,
    response: Response
  ) {
    try {
      let userimage: any = files;
      const { profileImage, coverImage } = userimage;
      let profileImagePath: string = "";
      let coverImagePath: string = "";
      if (userimage.profileImage) {
        profileImagePath = `${this.config.get("DEPLOY_URL")}/${
          profileImage[0].path
        }`;
      } else {
        profileImagePath = userDto.profileurl;
      }

      if (userimage.coverImage) {
        coverImagePath = `${this.config.get("DEPLOY_URL")}/${
          coverImage[0].path
        }`;
      } else {
        coverImagePath = userDto.coverurl;
      }

      let isupdated = await this.prisma.user.update({
        where: {
          id: userDto.userId,
        },
        data: {
          profileImage: profileImagePath,
          coverImage: coverImagePath,
          username: userDto.username,
          discordlink: userDto.discordlink,
          twitterlink: userDto.twitterlink,
          spendingAmount: userDto.spendingAmount,
        },
      });

      if (isupdated) {
        return response.status(200).json(isupdated);
      } else {
        throw new HttpException("Not Updated!!!", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  async logOut(access_token: string, response: Response) {
    try {
      const JWT_SECRET = this.config.get("JWT_SECRET");

      const isvalid = jwt.verify(access_token, JWT_SECRET);
      if (isvalid) {
        var payload = this.parseJwt(access_token);

        const user = await this.prisma.user.update({
          where: {
            id: payload.sub,
          },
          data: {
            refreshToken: null,
          },
        });

        if (user) {
          return {
            succes: true,
            status: HttpStatus.OK,
          };
        } else {
          throw new HttpException(
            "something went wrong!!",
            HttpStatus.BAD_REQUEST
          );
        }
      } else {
        throw new HttpException("invalid refreshtoken", HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  async getUserDetails(userId: string, response: Response) {
    try {
      let userDetails = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          wallets: {
            include: {
              WalletType: true,
            },
          },
          role: true,
        },
      });
      if (userDetails) {
        return response.status(200).json(userDetails);
      } else {
        throw new HttpException("No Record found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  async deleteuserfromdb(userId: string, response: Response) {
    try {
      let userDetails = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          isActive: false,
        },
      });
      if (userDetails) {
        return response.status(200).json({
          message: "User Disabled",
          success: true,
        });
      } else {
        throw new HttpException("No Record found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  async bloackuserfromdb(userId: string, response: Response) {
    try {
      let user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (user) {
        let userDetails = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            block: !user.block,
          },
          select: {
            block: true,
          },
        });
        return response.status(200).json({
          message: userDetails.block ? "User Blocked" : "User UnBlocked",
          success: userDetails.block,
        });
      } else {
        throw new HttpException("No Record found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  async getalluser(response: Response) {
    try {
      let allUser = await this.prisma.user.findMany({
        where: {
          isActive: true,
        },
        include: {
          wallets: {
            include: {
              WalletType: true,
            },
          },
          Subscription: {
            select: {
              id: true,
              subscription: true,
            },
          },
        },
      });
      if (allUser) {
        return response.status(200).json(allUser);
      } else {
        throw new HttpException("No Record found", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  async createUserSubscription(dto: SubcriptionsDto, response: Response) {
    try {
      let isSubcriptionCreated = await this.prisma.subscription.upsert({
        where: { id: dto.Id },
        create: {
          subscription: dto.subscription,
          userId: dto.userId,
        },
        update: {
          subscription: dto.subscription,
        },
      });
      if (isSubcriptionCreated) {
        return response.status(200).json(isSubcriptionCreated);
      } else {
        throw new HttpException(
          "Something went wroung!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  //====================================================================
  async allsubcription(response: Response) {
    try {
      let allsubcription = await this.prisma.subscription.findMany({
        select: {
          id: true,
          subscription: true,
          userId: true,
        },
      });
      if (allsubcription) {
        return response.status(200).json(allsubcription);
      } else {
        throw new HttpException("No Record found", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
