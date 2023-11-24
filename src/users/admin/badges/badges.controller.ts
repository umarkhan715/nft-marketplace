import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Res,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { BadgesService } from "./badges.service";
import {
  CreateBadgeDto,
  LevelDto,
  AssignBadgeDto,
  AttributesDto,
} from "./dto/create-badge.dto";
import { Response } from "express";
import { UpdateBadgeDto, UpdateLevelDto } from "./dto/update-badge.dto";

@Controller()
@ApiTags("Badges")
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  private logger = new Logger();

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Post("/assign")
  assignbadgetoUser(
    @Body() AssignBadgeDto: AssignBadgeDto,
    @Res() response: Response
  ) {
    return this.badgesService.assignbadgetoUser(AssignBadgeDto, response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Post("/create")
  createbadges(
    @Body() createBadgeDto: CreateBadgeDto,
    @Res() response: Response
  ) {
    return this.badgesService.createbadges(createBadgeDto, response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Post("/level")
  createlevel(@Body() createBadgeDto: LevelDto, @Res() response: Response) {
    return this.badgesService.createlevel(createBadgeDto, response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Get("/all")
  findAll(@Res() response: Response) {
    return this.badgesService.findallbadges(response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Get("/badge/:id")
  findsinglebadge(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.badgesService.findsinglebadge(id, response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Delete(":id")
  deletebadge(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.badgesService.deletebadges(id, response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Delete("/level/:id")
  deletelevel(@Param("id") id: string, @Res() response: Response) {
    return this.badgesService.deletelevel(id, response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Patch("/level/:id")
  updateLevel(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() levelDto: UpdateLevelDto,
    @Res() response: Response
  ) {
    return this.badgesService.updateLevel(id, levelDto, response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Patch(":id")
  updatebadges(
    @Param("id") id: string,
    @Body() updateBadgeDto: UpdateBadgeDto,
    @Res() response: Response
  ) {
    return this.badgesService.updatebadges(id, updateBadgeDto, response);
  }
  //=============================================================== // attributes
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Post("/attribute")
  createattribute(@Body() dto: AttributesDto, @Res() response: Response) {
    return this.badgesService.createattribute(dto, response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Get("/attribute")
  findallattribute(@Res() response: Response) {
    return this.badgesService.findallattribute(response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Delete("/attribute/:id")
  deletelattribute(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.badgesService.deletelattribute(id, response);
  }
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Get("/attribute/:id")
  findsingleattribute(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.badgesService.findsingleattribute(id, response);
  }
  //========================The End================================
}
