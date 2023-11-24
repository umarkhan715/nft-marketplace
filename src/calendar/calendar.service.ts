import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DbConnectionService } from "../db-connection/db-connection.service";
import { artGalleryDTO } from "./dto/artGallery-calendar.dto";
import { basicInfoCalendar } from "./dto/basicInfo-calendar.dto";
import { addtags, getCalendar } from "./dto/get-calendar.dto";
import { overviewCalendar } from "./dto/overview-calendar.dto";
import { createSaleType } from "./dto/saleType-calendar.dto";
import { calendarSocialLinks } from "./dto/socialLinks-calendar.dto";
import { teamCalendar } from "./dto/team-calendar.dto";
import { UpdateCalendarDto } from "./dto/update-calendar.dto";
import { Response } from "express";
import { SearchCalendar } from "./dto/searchcalendar.dto";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import { CalendarLikeDto } from "./dto/calenderLike.dto";
import { Calendar } from "@prisma/client";
import { CalendarFeedBackDto } from "./dto/feedback.calendar.dto";
import { CalendarRemoveGifDto } from "./dto/CalendarGifRemove";

@Injectable()
export class CalendarService {
  constructor(private db: DbConnectionService, private config: ConfigService) { }

  async create(
    dto: basicInfoCalendar,
    files: Express.Multer.File,
    response: Response
  ) {
    try {
      const { banner, profile }: any = files;
      var profilePath: string;
      var bannerPath: string;

      if (banner) {
        bannerPath = `${this.config.get("DEPLOY_URL")}/${banner[0].path}`;
      } else {
        if (dto.IsCoveriImageExist !== "null") {
          bannerPath = dto.IsCoveriImageExist;
        } else {
          bannerPath = this.config.get("BANNER_IMAGE");
        }
      }

      if (profile) {
        profilePath = `${this.config.get("DEPLOY_URL")}/${profile[0].path}`;
      } else {
        if (dto.IsProfileImageExist !== "null") {
          profilePath = dto.IsProfileImageExist;
        } else {
          profilePath = this.config.get("PROJECT_IMAGE");
        }
      }

      const res = await this.db.calendar.upsert({
        where: { id: dto.basicInfoId },
        update: {
          title: dto.title,
          description: dto.description,
          blockchainTypeId: dto.blockchainTypeId,
          profileImage: profilePath,
          bannerImage: bannerPath,
          category: dto.category,
          userId: dto.userId,
        },
        create: {
          title: dto.title,
          description: dto.description,
          blockchainTypeId: dto.blockchainTypeId,
          profileImage: profilePath,
          bannerImage: bannerPath,
          category: dto.category,
          status: dto.status,
          userId: dto.userId,
        },
      });
      if (res) {
        return response.status(201).json({
          data: res.id,
          message: `Calendar Basic Info in created `,
          success: true,
        });
      } else {
        throw new HttpException(
          "Calendar Basic Info Creation Error",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async createOverView(dto: overviewCalendar, response: Response) {
    try {
      const checkIfExist = await this.db.calendar.findMany({
        where: { id: dto.calendarId, userId: dto.userId },
      });
      if (!checkIfExist) {
        throw new NotFoundException(
          "The calendar not exist or you are not owner of this calendar Porject"
        );
      }
      let roadmapIdArr = [];

      let faqIdArr = [];
      await this.db.calendar.update({
        data: { overview: dto.introduction },
        where: { id: dto.calendarId },
      });
      for (var items of dto.FAQ) {
        let data = await this.db.calendarFAQ.upsert({
          where: { id: items.id },
          update: { question: items.question, answer: items.answer },
          create: {
            question: items.question,
            answer: items.answer,
            calendarId: dto.calendarId,
          },
        });
        faqIdArr.push(data.id);
      }
      for (let item of dto.roadmap) {
        let data = await this.db.roadMap.upsert({
          where: { id: item.id },
          update: { title: item.title, description: item.content },
          create: {
            title: item.title,
            description: item.content,
            calendarId: dto.calendarId,
          },
        });
        roadmapIdArr.push(data.id);
      }

      return response.status(200).json({
        data: "OverView , FAQ, RoadMAP Succesfuly Added", //res.id,
        insertedFaqId: faqIdArr,
        insertedroadmapId: roadmapIdArr,
        message: `OverView , FAQ, RoadMAP Succesfuly Added`,
        success: true,
      });
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findallteambycalenderid(calendarId: string, response: Response) {
    try {
      let allTeam = await this.db.team.findMany({
        where: {
          calendarId: calendarId,
        },
        select: {
          id: true,
          name: true,
          role: true,
          description: true,
          profileImage: true,
          profileLink: true,
          discordLink: true,
          twitter: true,
          LinkedIn: true,
          calendarId: true,
        },
      });

      if (allTeam.length !== 0) {
        return response.status(200).json(allTeam);
      } else {
        throw new HttpException("No Record found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async createTeam(
    dto: teamCalendar,
    file: Express.Multer.File,
    response: Response
  ) {
    console.log(dto), console.log(file);

    let teamImg: any = file;
    try {
      let profileImageUrl: string;
      if (teamImg.profileimage) {
        if (teamImg.profileimage[0].path === null) {
          profileImageUrl = this.config.get("PROFILE_IMAGE");
        } else {
          profileImageUrl = `${this.config.get("DEPLOY_URL")}/${teamImg.profileimage[0].path
            }`;
        }
      } else {
        profileImageUrl = dto.isExits;
      }

      let data = await this.db.team.upsert({
        where: { id: dto.id },
        update: {
          name: dto.name,
          description: dto.description,
          role: dto.role,
          profileLink: dto.socialLink,
          LinkedIn: dto.socialLink,
          twitter: dto.twitterLink,
          discordLink: dto.discordLink,
          calendarId: dto.calendarId,
          profileImage: profileImageUrl,
        },
        create: {
          name: dto.name,
          description: dto.description,
          role: dto.role,
          LinkedIn: dto.socialLink,
          twitter: dto.twitterLink,
          discordLink: dto.discordLink,
          profileLink: dto.socialLink,
          calendarId: dto.calendarId,
          profileImage: profileImageUrl,
        },
        select: {
          id: true,
          name: true,
          role: true,
          description: true,
          profileImage: true,
          profileLink: true,
          calendarId: true,
          discordLink: true,
          twitter: true,
          LinkedIn: true,
        },
      });
      if (data) {
        return response.status(200).json(data);
      } else {
        throw new HttpException("No Record found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findoneteammemberbyid(teamId: string, response: Response) {
    try {
      let singleMember = await this.db.team.findUnique({
        where: {
          id: teamId,
        },
        select: {
          id: true,
          name: true,
          role: true,
          description: true,
          profileImage: true,
          profileLink: true,
          calendarId: true,
        },
      });

      if (singleMember) {
        return response.status(200).json(singleMember);
      } else {
        throw new HttpException("No Record found", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  // deleteTeammemberFromTeamCalendar
  async deleteTeammemberFromTeamCalendar(teamid: string, response: Response) {
    try {
      const isTeamMemberDeleted = await this.db.team.delete({
        where: {
          id: teamid,
        },
      });
      if (isTeamMemberDeleted) {
        return response.status(200).json({
          success: true,
          status: HttpStatus.OK,
        });
      } else {
        throw new HttpException("No Record found", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async createSaleType(dto: createSaleType, response: Response) {
    try {
      var saletype: any = [];

      if (dto.saletypes.length > 0) {
        for (let item of dto.saletypes) {
          let addrow = await this.db.saleType.upsert({
            where: {
              id: item.id,
            },
            update: {
              type: item.launchType,
              starttime: item.launchDate,
              endTime: item.endTime,
              price: item.price,
            },
            create: {
              type: item.launchType,
              starttime: item.launchDate,
              price: item.price,
              endTime: item.endTime,
              calendarId: dto.calendarId,
            },
          });
          if (addrow) {
            saletype.push(addrow);
          }
        }
      }
      if (saletype) {
        return response.status(200).json({
          data: saletype,
          message: `Sales Type Added or updateed`,
          success: true,
        });
      } else {
        throw new HttpException("No Record found", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async createSocialLinks(dto: calendarSocialLinks, response: Response) {
    try {
      let isSuccess = await this.db.calendarSocialLinks.upsert({
        where: {
          id: dto.id,
        },
        update: {
          website: dto.website,
          discord: dto.discord,
          etherscan: dto.etherscan,
          twitter: dto.twitter,
        },
        create: {
          website: dto.website,
          discord: dto.discord,
          etherscan: dto.etherscan,
          twitter: dto.twitter,
          calendarId: dto.calendarId,
        },
        select: {
          id: true,
          website: true,
          discord: true,
          twitter: true,
          etherscan: true,
          calendarId: true,
        },
      });

      if (isSuccess) {
        return response.status(200).json({
          data: isSuccess,
          message: `SocialLinks Added successfully `,
          success: true,
        });
      } else {
        throw new HttpException("No Record found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async addtags(request: addtags, response: Response) {
    const { calendarId, tags } = request;
    try {
      await this.db.tags.deleteMany({
        where: { calendarId: calendarId },
      });

      let tagcreated = await this.db.tags.createMany({
        data: tags,
        // skipDuplicates: true,
      });
      if (tagcreated) {
        return response.status(201).json({
          success: true,
          addedTags: tagcreated.count,
        });
      } else {
        throw new HttpException(
          `Could not find tags for calendarId: ${calendarId}`,
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async addARTGallery(file: any, dto: artGalleryDTO, response: Response) {
    try {
      var filedata = [];

      if (file.gif) {
        await this.db.calendar.update({
          where: {
            id: dto.calendarId,
          },
          data: {
            calendarGif: `${this.config.get("DEPLOY_URL")}/${file.gif[0].path}`,
          },
        });
      }

      if (file.files) {
        const canuploadmedia: any = await this.imagevalidationcheck(
          file,
          dto,
          response
        );
        const { images } = canuploadmedia;
        const { canUploadimages } = images;
        if (canUploadimages) {
          filedata = file.files.map((file: any) => {
            let filedata = {
              path: `${this.config.get("DEPLOY_URL")}/${file.path}`,
              calendarId: dto.calendarId,
            };
            return filedata;
          });
        } else {
          return response
            .status(HttpStatus.UNPROCESSABLE_ENTITY)
            .json(canuploadmedia);
        }
      }

      const iscreated = await this.db.artGallery.createMany({
        data: filedata,
        // skipDuplicates: true,
      });

      if (iscreated) {
        let data = await this.db.calendar.findMany({
          where: {
            id: dto.calendarId,
          },
          select: {
            calendarGif: true,
            artGallery: {
              where: {
                calendarId: dto.calendarId,
                isactive: true,
              },
            },
          },
        });

        return response.status(201).json({
          data: data,
        });
      } else {
        throw new HttpException("something went wrong", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  // imagevalidation check
  async imagevalidationcheck(
    file: any,
    dto: artGalleryDTO,
    response: Response
  ) {
    try {
      var images = {};
      var imagefound = await this.db.artGallery.findMany({
        where: {
          calendarId: dto.calendarId,
          isactive: true,
        },
      });

      if (file.files) {
        if (imagefound.length >= 4) {
          images = {
            total: 4,
            occupied: imagefound.length,
            available: 4 - imagefound.length,
            canUploadimages: false,
            message: `${imagefound.length} out of 4  images are already occupied!`,
          };
        } else {
          let availableimages = 4 - imagefound.length;

          images = {
            total: 4,
            occupied: imagefound.length,
            available: 4 - imagefound.length,
            canUploadimages:
              file.files.length <= availableimages ? true : false,
            message: `${imagefound.length} out of 4 images are already occupied!`,
          };
        }
      } else {
        images = {
          total: 4,
          occupied: imagefound.length,
          available: 4 - imagefound.length,
          canUploadimages: true,
          message: `${imagefound.length} out of 4 images are already occupied!`,
        };
      }

      let data = await this.db.artGallery.findMany({
        where: {
          calendarId: dto.calendarId,
          isactive: true,
        },
      });

      return {
        images,
        data,
      };
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  //

  async getcalendarbyquery(query: getCalendar, response: Response) {
    try {
      const user = await this.db.user.findFirst({
        where: {
          id: query.userId,
        },
        include: {
          calendar: {
            where: {
              id: query.calendarId,
            },
            include: {
              saletype: true,
              vote: true,
              tags: true,
              team: true,
              roadMap: true,
              artGallery: {
                where: {
                  isactive: true,
                },
              },
              socialLinks: true,
              faq: true,
            },
          },
        },
      });
      if (user.calendar.length === 0) {
        throw new HttpException("No Record found", HttpStatus.NO_CONTENT);
      }
      if (query.detail === "all" || null) {
        return response.status(200).json({
          data: user,
          message: `Complete Calendar details`,
          success: true,
        });
      }
      if (query.detail === "socialLinks") {
        return response.status(200).json({
          data: user.calendar[0].socialLinks,
          message: `All the social Links`,
          success: true,
        });
      }
      if (query.detail === "saleType") {
        return response.status(200).json({
          data: user.calendar[0].saletype,
          message: `All the Saletype`,
          success: true,
        });
      }
      if (query.detail === "team") {
        return response.status(200).json({
          data: user.calendar[0].team,
          message: `All the Team`,
          success: true,
        });
      }
      if (query.detail === "artGallery") {
        return response.status(200).json({
          data: user.calendar[0].artGallery,
          message: `All the ArtGallery`,
          success: true,
        });
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async update(dto: UpdateCalendarDto, response: Response) {
    try {
      const basicData = dto.data[0];
      await this.db.calendar.update({
        data: {
          title: dto.data[0].title,
          description: dto.data[0].description,
          profileImage: dto.data[0].profileImage,
          bannerImage: dto.data[0].banner,
          blockchainTypeId: dto.data[0].blockchainTypeId,
          category: dto.data[0].category,
        },
        where: { id: dto.data[0].calendarId },
      });
      const FAQ = dto.data[1].FAQ;
      const roadmap = dto.data[2].roadmap;
      const teams = dto.data[3].teams;
      const gallery = dto.data[4].gallery;
      const link = dto.data[5].socialLink;
      if (FAQ.length > 0) {
        for (let i = 0; i < FAQ.length; i++) {
          await this.db.calendarFAQ.updateMany({
            data: { answer: FAQ[i].answer, question: FAQ[i].question },
            where: { calendarId: dto.data[0].calendarId },
          });
        }
      }
      if (roadmap.length > 0) {
        for (let i = 0; i < roadmap.length; i++) {
          await this.db.roadMap.updateMany({
            data: {
              title: roadmap[i].title,
              description: roadmap[i].content,
            },
            where: { calendarId: dto.data[0].calendarId },
          });
        }
      }

      return response.status(200).json(basicData);
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  // change image status artgallery
  async deleteImageArtGallery(artGalleryId: string, response: Response) {
    try {
      console.log();
      let isupdated = await this.db.artGallery.update({
        where: {
          id: artGalleryId,
        },
        data: {
          isactive: false,
        },
      });
      if (isupdated) {
        return response.status(200).json(isupdated);
      } else {
        throw new HttpException(
          "No Record found to Update",
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deletefaqs(FAQId: string, response: Response) {
    try {
      var isDeleted = await this.db.calendarFAQ.delete({
        where: {
          id: FAQId,
        },
      });
      if (isDeleted) {
        return response.status(200).json({
          success: true,
          mesaage: "Faqs deleted successfully",
        });
      } else {
        throw new HttpException(
          "No Record found to delete",
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  // delete roadmap service
  async deleteRoadmap(roadMapId: string, response: Response) {
    try {
      var isDeleted = await this.db.roadMap.delete({
        where: {
          id: roadMapId,
        },
      });
      if (isDeleted) {
        return response.status(200).json({
          succes: true,
          message: "RoadMAP Deleted Successfully",
        });
      } else {
        throw new HttpException(
          "No Record found to delete",
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  // delete tag service

  async deleteTags(tagId: string, response: Response) {
    try {
      var isDeleted = await this.db.tags.delete({
        where: {
          id: tagId,
        },
      });
      if (isDeleted) {
        return response.status(200).json({
          success: true,
          message: "Tag Deleted Successfully",
        });
      } else {
        throw new HttpException(
          "No Record found to delete",
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  // delete tag deleteSaleType
  async deleteSaleType(saleTypeId: string, response: Response) {
    try {
      var isDeleted = await this.db.saleType.delete({
        where: {
          id: saleTypeId,
        },
      });
      if (isDeleted) {
        return response.status(200).json({
          success: true,
          message: "Sale Type Deleted Successfully",
        });
      } else {
        throw new HttpException(
          "No Record found to delete",
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  // get all calendar
  async getAllCalender(response: Response) {
    try {
      let allcalendar = await this.db.calendar.findMany({
        include: {
          roadMap: true,
          team: true,
          tags: true,
          faq: true,
          saletype: true,
          socialLinks: true,
          artGallery: true,
          vote: true,
          calendarlikes: true,
        },
      });
      if (allcalendar) {
        let data: any;
        data = allcalendar;
        data.map((item) => {
          item.likes = item.calendarlikes.length;
          delete item.calendarlikes;
        });
        return response.status(200).json(allcalendar);
      } else {
        throw new HttpException("No Record found", HttpStatus.NO_CONTENT);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  // get calendar by id
  async getcalenderbyid(calendarId: string, response: Response) {
    try {
      console.log(calendarId);
      let allcalendar = await this.db.calendar.findUnique({
        where: {
          id: calendarId,
        },
        include: {
          roadMap: true,
          team: true,
          tags: true,
          faq: true,
          saletype: true,
          socialLinks: true,
          artGallery: true,
          vote: true,
          calendarlikes: true,
        },
      });
      if (allcalendar) {
        let data: any;
        data = allcalendar;
        data.likes = data.calendarlikes.length;
        delete data.calendarlikes;
        return response.status(200).json(allcalendar);
      } else {
        throw new HttpException("No Record found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  dateselectionfromquery(query: string) {
    var date = new Date();
    switch (query) {
      case "7 Days":
        console.log("7 Days");
        date.setDate(date.getDate() + 7);
        break;
      case "1 Month":
        console.log("1 Month");
        date.setDate(date.getDate() + 30);

        break;
      case "3 Month":
        console.log("3 Month");
        date.setDate(date.getDate() + 90);

        break;
      case "6 Month":
        console.log("6 Month");
        date.setDate(date.getDate() + 180);

        break;
      case "1 Year":
        console.log("1 Year");
        date.setDate(date.getDate() + 365);

        break;
      case "none":
        console.log("none");
        date = null;
        break;
    }

    return date;
  }

  async searhcalendar(query: SearchCalendar, response: Response) {
    try {
      let todayDate = new Date();
      let data: any;
      const { category, Upcoming, blockchain, launchDate, Userid } = query;

      let pageNo: number | undefined =
        query.pageNo == undefined ? 0 : query?.pageNo;
      let limit: number | undefined =
        query.limit == undefined ? 0 : query?.limit;
      let calendarCount = await this.db.calendar.count();
      let allcalendar = await this.db.calendar.findMany({
        where: {
          userId: query.Userid ?? undefined,
          category: query.category === "All" ? undefined : query.category,
        },
        orderBy: {
          featured: "desc",
        },
        skip: pageNo * limit,
        take: query?.limit,
        include: {
          saletype: {
            select: {
              type: true,
              starttime: true,
              endTime: true,
            },
          },
          socialLinks: true,
          roadMap: true,
          tags: true,
          team: true,
          blockchainType: {
            select: {
              id: true,
              blockChainName: true,
              blockChainIcon: true,
            },
          },
          calendarlikes: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (allcalendar.length === 0) {
        return response.status(HttpStatus.OK).json({
          pageNo: pageNo,
          limit: limit,
          total: calendarCount,
          data: allcalendar,
        });
      }
      console.log(allcalendar.length);
      data = allcalendar;

      if (Upcoming) {
        if (Upcoming !== "All") {
          let upcomingDate = this.dateselectionfromquery(Upcoming);
          // console.log("today date", todayDate);
          // console.log("upcoming date", upcomingDate);

          let localupcoming = [];
          (await data).forEach((element) => {
            if (todayDate && upcomingDate) {
              let launchDate = new Date(element.launchDate);
              if (launchDate <= upcomingDate && launchDate >= todayDate) {
                localupcoming.push(element);
              }
            }
          });
          data = localupcoming;
        }
      }
      if (blockchain) {
        if (blockchain !== "All") {
          let localblockchain = [];
          (await data).forEach((element) => {
            if (element.blockchainType.blockChainName === blockchain) {
              localblockchain.push(element);
            }
          });
          data = localblockchain;
        }
      }

      if (launchDate !== "null") {
        let newDate = new Date(launchDate).toLocaleDateString();
        let calenderAtSpecificDate = [];
        // data.forEach((item) => {
        //   if (item.saletype.length !== 0) {
        //     let saletypeDate = new Date(
        //       item.saletype[0].starttime
        //     ).toLocaleDateString();
        //     if (saletypeDate === newDate) {
        //       calenderAtSpecificDate.push(item);
        //     }
        //   }
        // });
        data.forEach((item) => {
          let launchDatedb = new Date(item.launchDate).toLocaleDateString();
          if (launchDatedb === newDate) {
            calenderAtSpecificDate.push(item);
          }
        });
        data = calenderAtSpecificDate;
      }

      let _todayDate = new Date().toLocaleDateString();

      data.map((item, index) => {
        for (let i = 0; i < item.saletype.length; i++) {
          if (
            item.saletype[i]?.starttime &&
            _todayDate >=
            new Date(`${item.saletype[i]?.starttime}`).toLocaleDateString() &&
            item.saletype[i]?.endTime &&
            _todayDate <=
            new Date(`${item.saletype[i]?.endTime}`).toLocaleDateString()
          ) {
            item.status = item.saletype[i].type;
          } else if (
            _todayDate >=
            new Date(item.saletype[i]?.endtime).toLocaleDateString()
          ) {
            item.status = "Expired";
          }
        }
      });

      data.map(
        (item: { likes: any; calendarlikes: any[]; islike: boolean }) => {
          item.likes = item.calendarlikes.length;
          if (item.calendarlikes.length > 0) {
            var foundValue = item.calendarlikes.filter(
              (obj: { userId: string }) => obj.userId === Userid
            );
            if (foundValue) {
              item.islike = true;
            }
          } else {
            item.islike = false;
          }
          delete item.calendarlikes;
        }
      );

      return response.status(HttpStatus.OK).json({
        recordsReturn: allcalendar.length,
        pageNo: pageNo,
        limit: limit,
        total: calendarCount,
        data,
      });
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  // async getrandomccalendar(response: Response) {
  //   try {
  //     let randomCalendar: [] = await this.db.$queryRawUnsafe(
  //       `SELECT id FROM "Calendar"  ORDER BY RANDOM() LIMIT 4;`
  //     );

  //     let calendarIds = randomCalendar.map((calender: any) => calender.id);

  //     if (randomCalendar.length !== 0) {
  //       let tempCalendar = await this.db.calendar.findMany({
  //         where: {
  //           id: { in: calendarIds },
  //         },
  //         include: {
  //           roadMap: true,
  //           team: true,
  //           tags: true,
  //           faq: true,
  //           saletype: true,
  //           socialLinks: true,
  //           artGallery: true,
  //           vote: true,
  //           calendarlikes: true,
  //         },
  //       });

  //       if (tempCalendar) {
  //         let data: any = tempCalendar;
  //         data.map(
  //           (item: { likes: any; calendarlikes: any[]; islike: boolean }) => {
  //             item.likes = item.calendarlikes.length;
  //             delete item.calendarlikes;
  //           }
  //         );
  //         return response.status(200).json(tempCalendar);
  //       }
  //     } else {
  //       throw new HttpException("No Record found", HttpStatus.NO_CONTENT);
  //     }
  //   } catch (error) {
  //     PrismaException.prototype.findprismaexception(error, response);
  //   }
  // }

  async userCalenderlike(dto: CalendarLikeDto, response: Response) {
    try {
      let data: any;
      let islikeExitBefore = await this.db.calendarLikes.findMany({
        where: {
          userId: dto.userId,
          calendarId: dto.calenderId,
        },
        include: {
          Calendar: true,
        },
      });

      if (islikeExitBefore.length !== 0) {
        let isdislike = await this.db.calendarLikes.delete({
          where: {
            id: islikeExitBefore[0].id,
          },
        });
        if (isdislike) {
          let calendar = await this.db.calendar.findUnique({
            where: {
              id: dto.calenderId,
            },
            include: {
              roadMap: true,
              team: true,
              tags: true,
              faq: true,
              saletype: true,
              socialLinks: true,
              artGallery: true,
              vote: true,
              calendarlikes: true,
            },
          });
          if (calendar) {
            data = calendar;
            data.likes = data.calendarlikes.length;
            data.islike = false;
            delete data.calendarlikes;
          }

          response.status(HttpStatus.OK).json(data);
        }
      } else {
        let isLikeCreated = await this.db.calendarLikes.create({
          data: {
            userId: dto.userId,
            calendarId: dto.calenderId,
          },
        });
        if (isLikeCreated) {
          let calendar = await this.db.calendar.findUnique({
            where: {
              id: dto.calenderId,
            },
            include: {
              roadMap: true,
              team: true,
              tags: true,
              faq: true,
              saletype: true,
              socialLinks: true,
              artGallery: true,
              vote: true,
              calendarlikes: true,
            },
          });
          if (calendar) {
            data = calendar;
            data.likes = data.calendarlikes.length;
            data.islike = true;
            delete data.calendarlikes;
          }

          response.status(200).send(data);
        } else {
          throw new HttpException(
            "Could not add like to calender",
            HttpStatus.BAD_REQUEST
          );
        }
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getblockchainTypeWithTotalCalendar(response: Response) {
    try {
      const BlockChainList = await this.db.blockchainType.findMany({
        select: {
          id: true,
          blockChainName: true,
          blockChainIcon: true,
          Calendar: true,
        },
      });

      BlockChainList.map((item: any, index) => {
        item.Calendars = item.Calendar.length;
        delete item.Calendar;
      });

      const catogoryList = await this.db.calendar.groupBy({
        by: ["category"],
        _count: {
          _all: true,
        },
      });

      return response
        .status(HttpStatus.OK)
        .send({ BlockChainList, catogoryList });
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async verifiedCalendar(id: string, response: Response) {
    try {
      let isverified = await this.db.calendar.update({
        data: {
          verifields: true,
        },
        where: { id: id },
      });
      if (isverified) {
        return response.status(200).json({
          success: true,
        });
      } else {
        throw new HttpException(
          "Calendar Cannot be verified !!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async featuredcalendar(id: string, response: Response) {
    try {
      let isFeatured = await this.db.calendar.update({
        data: {
          featured: true,
        },
        where: { id: id },
      });
      if (isFeatured) {
        return response.status(200).json({
          success: true,
        });
      } else {
        throw new HttpException(
          "Calendar Cannot be featured !!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  // feedback

  async CreatefeebackCalendar(dto: CalendarFeedBackDto, response: Response) {
    try {
      let feedback = await this.db.calendarFeedback.create({
        data: {
          feedback_username: dto.feedback_username,
          feedback_email: dto.feedback_email,
          feedback_content: dto.feedback_content,
          calendarId: dto.calenderId,
        },
      });
      if (feedback) {
        response.status(HttpStatus.OK).json(feedback);
      } else {
        throw new HttpException(
          "Calendar Feedback Cannot be Created!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getfeebackCalendarId(id: string, response: Response) {
    try {
      let feedbacks = await this.db.calendarFeedback.findMany({
        where: {
          calendarId: id,
        },
      });
      if (feedbacks) {
        response.status(HttpStatus.OK).json(feedbacks);
      } else {
        throw new HttpException(
          "Calendar Feedback Cannot be Created!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async removeCalendarGif(
    dto: CalendarRemoveGifDto,
    response: Response<any, Record<string, any>>
  ) {
    try {
      let calendarId = dto.calenderId;
      let res = await this.db.calendar.update({
        data: { calendarGif: "" },
        where: { id: calendarId },
      });
      if (res) {
        response.status(HttpStatus.OK).json(res);
      } else {
        throw new HttpException(
          "Calendar Feedback Cannot be Created!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
