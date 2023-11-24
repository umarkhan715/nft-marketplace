import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateLaunchpadDto,
  LaunchpadQuery,
  SingleLaunchpadQuery,
  UpdateBlockContractAddressDto,
  UploadImageMetadatLaunchpadto_IPFS_Dto,
  UserProjectQuery,
} from "./dto/create-launchpad.dto";
import { PrismaService } from "src/prisma/prisma.service";
import fs, { readFileSync } from "fs";
import { getFilesFromPath } from "files-from-path";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";

import { UpdateLaunchpadDto } from "./dto/update-launchpad.dto";
const { NFTStorage } = require("nft.storage");
@Injectable()
export class LaunchpadService {
  constructor(
    private readonly prisma: PrismaService,
    private config: ConfigService
  ) {}

  async createLaunchpadProject(
    dto: CreateLaunchpadDto,
    file: Express.Multer.File,
    response: Response
  ) {
    try {
      let _profileImage = "";
      let _bannerImage = "";
      console.log(file);
      let image: any = file;

      let isProjectExit = await this.prisma.launchPadProject.findFirst({
        where: {
          name: dto.title,
          blockchainTypeId: dto.blockchainTypeId,
        },
      });
      console.log(isProjectExit);
      if (isProjectExit) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          error: "Project already exits",
        });
      }

      if (image.profileImage) {
        _profileImage = `${this.config.get("DEPLOY_URL")}/${
          image.profileImage[0].path
        }`;
      }

      if (image.bannerImage) {
        _bannerImage = `${this.config.get("DEPLOY_URL")}/${
          image.bannerImage[0].path
        }`;
      }

      let isProjectCreated = await this.prisma.launchPadProject.create({
        data: {
          name: dto.title,
          description: dto.description,
          blockchainTypeId: dto.blockchainTypeId,
          nftquantity: dto.total_quantity,
          walletAddress: dto.walletAddress,
          type: dto.type,
          twitterLink: dto.twitter_link,
          discordLink: dto.discord_link,
          profileImage: _profileImage,
          bannerImage: _bannerImage,
          userId: dto.userId,
        },
      });
      if (isProjectCreated) {
        return response.status(HttpStatus.OK).json(isProjectCreated);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getsingleLaunchPad(launchPadId: string, response: Response) {
    try {
      let _launchPadProject = await this.prisma.launchPadProject.findUnique({
        where: {
          id: launchPadId,
        },
        include: {
          BlockchainType: true,
        },
      });
      if (_launchPadProject) {
        return response.status(HttpStatus.OK).json(_launchPadProject);
      } else {
        throw new HttpException("Not Found!!!", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findByProjectName(query: SingleLaunchpadQuery, response: Response) {
    try {
      console.log(query);
      let _launchPadProject = await this.prisma.launchPadProject.findFirst({
        where: {
          name: query.projectname,
          blockchainTypeId: query.blockchainTYpeId ?? undefined,
        },
        include: {
          BlockchainType: true,
        },
      });
      if (_launchPadProject) {
        return response.status(HttpStatus.OK).json(_launchPadProject);
      } else {
        throw new HttpException("Not Found!!!", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getAllProject(query: LaunchpadQuery, response: Response) {
    try {
      let _launchPadProject = await this.prisma.launchPadProject.findMany({
        where: {
          blockchainTypeId: query.blockchainTYpeId ?? undefined,
        },
        include: {
          BlockchainType: true,
        },
      });
      if (_launchPadProject.length !== 0) {
        return response.status(HttpStatus.OK).json(_launchPadProject);
      } else {
        throw new HttpException("Not Found!!!", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getuserLaunchPadProject(query: UserProjectQuery, response: Response) {
    try {
      console.log("in route", query);
      let filterList = [];
      if (query.BlockChainType == "All") {
        let blockChainTypeList = await this.prisma.blockchainType.findMany({
          select: { blockChainName: true },
        });
        blockChainTypeList.map((item) => {
          filterList.push(item.blockChainName);
        });
      } else {
        filterList.push(query.BlockChainType);
      }

      console.log(filterList);
      let _launchPadProject = await this.prisma.launchPadProject.findMany({
        where: {
          userId: query.userId,
          BlockchainType: {
            blockChainName: {
              in: filterList,
            },
          },
        },
        include: {
          BlockchainType: true,
        },
      });
      if (_launchPadProject.length !== 0) {
        return response.status(HttpStatus.OK).json(_launchPadProject);
      } else {
        throw new HttpException("Not Found!!!", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async updateLaunchPadProject(
    file: Express.Multer.File,
    dto: UpdateLaunchpadDto,
    response: Response
  ) {
    try {
      let isLaunchPadUserExist = await this.prisma.launchPadProject.findFirst({
        where: {
          id: dto.launchPadProjectId,
          userId: dto.userid,
        },
      });

      if (!isLaunchPadUserExist) {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: "User does not exist in the launchpad project",
        });
      }

      let _profileImage = "";
      let _bannerImage = "";
      console.log(file);
      let image: any = file;

      if (image.profileImage) {
        _profileImage = `${this.config.get("DEPLOY_URL")}/${
          image.profileImage[0].path
        }`;
      }

      if (image.bannerImage) {
        _bannerImage = `${this.config.get("DEPLOY_URL")}/${
          image.bannerImage[0].path
        }`;
      }

      let _launchPadProject = await this.prisma.launchPadProject.update({
        where: {
          id: dto.launchPadProjectId,
        },
        data: {
          name: dto.title,
          description: dto.description,
          nftquantity: dto.total_quantity,
          walletAddress: dto.walletAddress,
          type: dto.type,
          twitterLink: dto.twitter_link,
          discordLink: dto.discord_link,
          profileImage: _profileImage,
          bannerImage: _bannerImage,
        },
      });
      console.log(_launchPadProject);
      if (_launchPadProject) {
        return response.status(HttpStatus.OK).json(_launchPadProject);
      } else {
        throw new HttpException("Not Found!!!", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async UploadMetadataByJsonFile(
    dto: UploadImageMetadatLaunchpadto_IPFS_Dto,
    file: any,
    response: Response,
    request: Request
  ) {
    try {
      const { projectname, blockchaintype } = request.headers;
      const { Image, MetaData } = file;
      console.log(projectname, blockchaintype);

      let Image_Url = "";
      let metaData_Url = "";

      //=================================uploading Images================================
      if (
        !fs.existsSync(
          `./public/ArtGeneration/${blockchaintype}/${projectname}/Images`
        )
      )
        return new HttpException(
          "Images  folder does not exist!!",
          HttpStatus.NOT_FOUND
        );

      let token = null,
        ImagesPath = null;
      token = process.env.NFT_STORAGE_TOKEN;
      if (!token) {
        throw new Error("NFT Storage Token Error");
      }

      ImagesPath = `${process.env.GENERATED_ART_PATH}/ArtGeneration/${blockchaintype}/${projectname}/Images`;
      if (!ImagesPath) {
        throw new Error("Images folder does not exist");
      }
      const files = await getFilesFromPath(`${ImagesPath}`);
      const storage = new NFTStorage({ token });
      console.log(
        "Uploading Images................................................................"
      );
      const ImagesCID = await storage.storeDirectory(files, {
        pathPrefix: ImagesPath,
        hidden: true,
      });
      console.log({ ImagesCID });
      Image_Url = `https://${ImagesCID}.ipfs.nftstorage.link/Images`;
      // converting combine file to invidual json file
      if (
        !fs.existsSync(
          `./public/ArtGeneration/${blockchaintype}/${projectname}/metaData`
        )
      ) {
        fs.mkdirSync(
          `./public/ArtGeneration/${blockchaintype}/${projectname}/metaData`,
          { recursive: true }
        );
      }

      if (dto.jsonFile === "true") {
        let MetaDataJsonFile = [];

        const data = fs
          .readFileSync(
            `./public/ArtGeneration/${blockchaintype}/${projectname}/metaData/${MetaData[0].filename}`
          )
          .toString();
        MetaDataJsonFile = JSON.parse(data);
        MetaDataJsonFile.map((element, index) => {
          element.ServerUrl = `${this.config.get("DEPLOY_URL")}/${
            Image[index].path
          }`;
          element.image = `https://${ImagesCID}.ipfs.nftstorage.link/Images/${Image[index].filename}`;
          fs.writeFileSync(
            `./public/ArtGeneration/${blockchaintype}/${projectname}/metaData/${index}.json`,
            JSON.stringify(element)
          );
        });
      } else {
        let NFT_List = JSON.parse(dto.data);
        NFT_List.map((element, index) => {
          element.ServerUrl = `${this.config.get("DEPLOY_URL")}/${
            Image[index].path
          }`;
          element.image = `https://${ImagesCID}.ipfs.nftstorage.link/Images/${Image[index].filename}`;
          fs.writeFileSync(
            `./public/ArtGeneration/${blockchaintype}/${projectname}/metaData/${index}.json`,
            JSON.stringify(element)
          );
        });
      }

      //=============================uploading new meta data =============================

      let MetaDataPath = `${process.env.GENERATED_ART_PATH}/ArtGeneration/${blockchaintype}/${projectname}/metaData`;
      if (!MetaDataPath) {
        throw new Error("MetaData folder does not exist");
      }

      const MetaDatafiles = await getFilesFromPath(`${MetaDataPath}`);
      const MetaDatastorage = new NFTStorage({ token });
      console.log(
        "Uploading MetaData................................................................"
      );
      const MetaDataCID = await MetaDatastorage.storeDirectory(MetaDatafiles, {
        pathPrefix: MetaDataPath,
        hidden: true,
      });
      console.log({ MetaDataCID });
      metaData_Url = `https://${MetaDataCID}.ipfs.nftstorage.link/metaData`;

      //=============================saving data to db=====================================
      console.log(
        `--------------------saving data to db-----------------------`
      );
      let _createdLaunchPadProject = await this.prisma.launchPadProject.update({
        where: {
          id: dto.launchPadProjectId,
        },
        data: {
          ipfsUrlImage: Image_Url,
          ipfsUrlmetadata: metaData_Url,
        },
      });

      if (_createdLaunchPadProject) {
        return response.status(HttpStatus.OK).json({
          success: true,
          data: _createdLaunchPadProject,
        });
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async UpdateSalanaProjectContractAddress(
    dto: UpdateBlockContractAddressDto,
    response: Response
  ) {
    try {
      let userLaunchPadExit = await this.prisma.launchPadProject.findFirst({
        where: {
          id: dto.launchPadProjectId,
          userId: dto.userid,
        },
      });
      if (userLaunchPadExit) {
        if (dto.blockChainType === "Solana") {
          let isUpdated = await this.prisma.launchPadProject.update({
            where: {
              id: dto.launchPadProjectId,
            },
            data: {
              solanaContractAddress: dto.solanaContractAddress,
            },
          });

          if (isUpdated) {
            response.status(HttpStatus.OK).json(isUpdated);
          } else {
            throw new HttpException(
              "Error Updating the LaunchPad Project!!!",
              HttpStatus.BAD_REQUEST
            );
          }
        } else if (dto.blockChainType === "Ethreum") {
          let isUpdated = await this.prisma.launchPadProject.update({
            where: {
              id: dto.launchPadProjectId,
            },
            data: {
              preSaleContractAddress: dto.preSaleContractAddress,
              publicSaleContractAddress: dto.publicSaleContractAddress,
            },
          });
          if (isUpdated) {
            response.status(HttpStatus.OK).json(isUpdated);
          } else {
            throw new HttpException(
              "Error Updating the LaunchPad Project!!!",
              HttpStatus.BAD_REQUEST
            );
          }
        }
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
