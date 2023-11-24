import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Logger,
  Query,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Res,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { artGalleyValidator } from "../common/decorator/artGalleryValidator";
import { bannerProfileValidator } from "../common/decorator/bannerProfile";
import { GetUser } from "../common/decorator/getCurrentUser";
import { teamImageValidator } from "../common/decorator/teamImage";
import { CalendarService } from "./calendar.service";
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
import { CalendarLikeDto } from "./dto/calenderLike.dto";
import { Calendar } from "@prisma/client";
import {
  CalendarEntity,
  CalenderLikeEntity,
  CalenderArtGalleryEntity,
  artGalleryEntity,
  AddTagCalenderEntity,
  CalendarSocialLinksEntity,
  CalendarSaleTypeEnity,
  calendarTeamEntity,
  calendarDeleteSaleTypeEntity,
  calendarDeleteTagsEntity,
  CalendarRoadmapEntity,
  CalendarFAQDeleteEntity,
  blockchainTypes,
} from "./entity/calender.Entitty";
import { CalendarFeedBackDto } from "./dto/feedback.calendar.dto";
import { CalendarRemoveGifDto } from "./dto/CalendarGifRemove";

@ApiTags("Calendar")
@ApiBadRequestResponse({
  status: 400,
  description: "Bad Request!!",
})
@ApiNotFoundResponse({
  status: 404,
  description: "Not Found!!",
})
@Controller()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }
  private readonly logger = new Logger(CalendarController.name);

  //====================================================================

  //@UseGuards(JwtGuard)
  @Post("basicInfo")
  //@GetUser()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(bannerProfileValidator)
  create(
    @UploadedFiles() files: Express.Multer.File,
    @Body() createCalendarDto: basicInfoCalendar,
    @Res() response: Response
  ) {
    return this.calendarService.create(createCalendarDto, files, response);
  }
  //====================================================================

  @Post("overview")
  createOverView(
    @Body() createOverviewDto: overviewCalendar,
    @Res() response: Response
  ) {
    return this.calendarService.createOverView(createOverviewDto, response);
  }
  //====================================================================
  // delete faqs api controller

  @Delete("faq/:id")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalendarFAQDeleteEntity,
  })
  deletefaqs(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.calendarService.deletefaqs(id, response);
  }
  //====================================================================
  //  delete roadmap api controller

  @Delete("roadmap/:id")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalendarRoadmapEntity,
  })
  deleteRoadmap(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.calendarService.deleteRoadmap(id, response);
  }
  //====================================================================
  //  delete tags api controller

  @Delete("tag/:id")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: calendarDeleteTagsEntity,
  })
  deleteTags(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.calendarService.deleteTags(id, response);
  }
  //====================================================================
  //  delete saleType api controller

  @Delete("saletype/:id")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: calendarDeleteSaleTypeEntity,
  })
  deleteLaunchInfo(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.calendarService.deleteSaleType(id, response);
  }
  //====================================================================
  // get team member by ID

  @Get("/teamember/:id")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: calendarTeamEntity,
  })
  findoneteammemberbyid(
    @Param("id", new ParseUUIDPipe()) teamId: string,
    @Res() response: Response
  ) {
    return this.calendarService.findoneteammemberbyid(teamId, response);
  }

  //====================================================================

  @Post("team")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: calendarTeamEntity,
  })
  @UseInterceptors(teamImageValidator)
  createTeam(
    @UploadedFiles() file: Express.Multer.File,
    @Body() createTeamDto: teamCalendar,
    @Res() response: Response
  ) {
    return this.calendarService.createTeam(createTeamDto, file, response);
  }

  //====================================================================

  @Get("team/:calenderId")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [calendarTeamEntity],
  })
  findallteam(
    @Param("calenderId", new ParseUUIDPipe()) calenderID: string,
    @Res() response: Response
  ) {
    return this.calendarService.findallteambycalenderid(calenderID, response);
  }

  //====================================================================
  // delete team member from teamCalendar

  @Delete("/del/:teamId")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: calendarTeamEntity,
  })
  deleteTeammemberFromTeamCalendar(
    @Param("teamId", new ParseUUIDPipe()) teamId: string,
    @Res() response: Response
  ) {
    return this.calendarService.deleteTeammemberFromTeamCalendar(
      teamId,
      response
    );
  }

  //====================================================================

  @Post("saleType")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalendarSaleTypeEnity,
  })
  createSaleType(
    @Body() createSaleTypeDto: createSaleType,
    @Res() response: Response
  ) {
    return this.calendarService.createSaleType(createSaleTypeDto, response);
  }
  //====================================================================

  @Post("socialLinks")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalendarSocialLinksEntity,
  })
  createSocialLinks(
    @Body() createSocialLinksDto: calendarSocialLinks,
    @Res() response: Response
  ) {
    return this.calendarService.createSocialLinks(
      createSocialLinksDto,
      response
    );
  }
  //====================================================================

  @Post("addtags")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: AddTagCalenderEntity,
  })
  async addtags(@Body() dto: addtags, @Res() response: Response) {
    return await this.calendarService.addtags(dto, response);
  }
  //====================================================================

  @Patch("artgalleryid/:id")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: artGalleryEntity,
  })
  async updateImageStatus(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return await this.calendarService.deleteImageArtGallery(id, response);
  }
  //====================================================================

  @Post("artGallery")
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalenderArtGalleryEntity,
  })
  @UseInterceptors(artGalleyValidator)
  async uploadmultipleFile(
    @UploadedFiles() file: Express.Multer.File,
    @Body() addartGalleryDTO: artGalleryDTO,
    @Res() response: Response
  ) {
    return await this.calendarService.addARTGallery(
      file,
      addartGalleryDTO,
      response
    );
  }
  //====================================================================

  // @UseInterceptors(CacheInterceptor)
  // @CacheKey('singleCalendar')
  // @CacheTTL(0)
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalendarEntity,
  })
  @Get("/")
  getsaletype(@Query() query: getCalendar, @Res() response: Response) {
    return this.calendarService.getcalendarbyquery(query, response);
  }
  //====================================================================

  @Patch(":id")
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCalendarDto,
    @Res() response: Response
  ) {
    return this.calendarService.update(dto, response);
  }
  //====================================================================
  //  get all calendars

  @Get("/allcalendar")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [CalendarEntity],
  })
  getAllCalender(@Res() response: Response) {
    return this.calendarService.getAllCalender(response);
  }
  //====================================================================
  //  get all calendars

  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalendarEntity,
  })
  @Get("/calendardetails/:id")
  getcalendarbyid(
    @Param("id", new ParseUUIDPipe()) calendarId: string,
    @Res() response: Response
  ) {
    return this.calendarService.getcalenderbyid(calendarId, response);
  }
  //====================================================================

  @Get("/search")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [CalendarEntity],
  })
  calendersearch(@Query() query: SearchCalendar, @Res() response: Response) {
    return this.calendarService.searhcalendar(query, response);
  }
  //====================================================================

  // @Get("/random")
  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  //   type: [CalendarEntity],
  // })
  // getrandomccalendar(@Res() response: Response) {
  //   return this.calendarService.getrandomccalendar(response);
  // }
  //====================================================================

  @Post("/like")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalenderLikeEntity,
  })
  userCalenderlike(@Body() dto: CalendarLikeDto, @Res() response: Response) {
    return this.calendarService.userCalenderlike(dto, response);
  }
  //====================================================================
  @Get("/fitlerlist")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [blockchainTypes],
  })
  blockchainType(@Res() response: Response) {
    return this.calendarService.getblockchainTypeWithTotalCalendar(response);
  }
  //====================================================================

  @Patch("/verifieldcalendar/:id")
  verifiedCalendar(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.calendarService.verifiedCalendar(id, response);
  }
  //====================================================================
  @Patch("/featuredcalendar/:id")
  featuredcalendar(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.calendarService.featuredcalendar(id, response);
  }
  //====================================================================
  @Post("/feedback")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalenderLikeEntity,
  })
  CreatefeebackCalendar(
    @Body() dto: CalendarFeedBackDto,
    @Res() response: Response
  ) {
    return this.calendarService.CreatefeebackCalendar(dto, response);
  }
  //====================================================================
  @Post("/removeCalendarGif")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalenderLikeEntity,
  })
  RemoveCallendarGif(
    @Body() dto: CalendarRemoveGifDto,
    @Res() response: Response
  ) {
    return this.calendarService.removeCalendarGif(dto, response);
  }
  //====================================================================
  @Get("/feedback/:id")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: CalenderLikeEntity,
  })
  getfeebackCalendarId(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.calendarService.getfeebackCalendarId(id, response);
  }
  //========================THE END=====================================
}
