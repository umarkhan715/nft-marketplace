import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { Adminlogindto, CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { Response } from "express";
import { AdminCredentailEntity, AdminEntity } from "./entity/adminEntity";

@ApiBadRequestResponse({
  status: 400,
  description: "Bad Request!!",
})
@ApiNotFoundResponse({
  status: 404,
  description: "Not Found!!",
})
@ApiTags("Admin")
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("/creatCredentials")
  @ApiCreatedResponse({
    status: 201,
    type: AdminEntity,
    description: "Created",
  })
  async create(
    @Body() createUserDto: CreateAdminDto,
    @Res() response: Response
  ) {
    return this.adminService.createCredentails(createUserDto, response);
  }

  @Get("/getallCredentails")
  @ApiCreatedResponse({
    status: 200,
    type: [AdminEntity],
    description: "All Credentails",
  })
  async getallCredentails(@Res() response: Response) {
    return this.adminService.getallCredentails(response);
  }

  @Get("/getallmoderator")
  @ApiCreatedResponse({
    status: 200,
    type: [AdminEntity],
    description: "All Credentails",
  })
  async getallmoderator(@Res() response: Response) {
    return this.adminService.getallmoderator(response);
  }

  @Post("/login")
  @ApiCreatedResponse({
    status: 201,
    type: AdminCredentailEntity,
    description: "Login Successfully",
  })
  async adminlogin(
    @Body() createAdminDto: Adminlogindto,
    @Res() response: Response
  ) {
    return this.adminService.adminlogin(createAdminDto, response);
  }

  @Delete("/delete/:id")
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: AdminEntity,
  })
  deleteCredentails(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.adminService.deleteCredentails(id, response);
  }
}
