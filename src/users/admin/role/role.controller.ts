import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Put,
  ParseUUIDPipe,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import {
  AddModeratorDto,
  AddModeratorWithEmailDto,
  CreateRoleDto,
  updateModeratorControls,
} from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
@ApiTags("User Role")
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Get("/getalluserrole")
  getAllUserRole(@Res() response: Response) {
    return this.roleService.getAllUserRole(response);
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
  @Get("/getuserbyroleid/:id")
  getuserbyroleid(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.roleService.getuserbyroleid(id, response);
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
  @Post("/createrole")
  createRole(@Body() createRoleDto: CreateRoleDto, @Res() response: Response) {
    return this.roleService.createRole(createRoleDto, response);
  }

  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Get("/getallrole")
  findAllRole(@Res() response: Response) {
    return this.roleService.findAllRole(response);
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
  @Get("/allcontrollist")
  getallControl(@Res() response: Response) {
    return this.roleService.getallControl(response);
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
  @Get("/:id")
  findsinglerole(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.roleService.findsinglerole(id, response);
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
  updaterole(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() response: Response
  ) {
    return this.roleService.updaterole(id, updateRoleDto, response);
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
  deleteRole(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.roleService.deleteRole(id, response);
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
  @Post("/addmoderator")
  addModerator(@Body() dto: AddModeratorDto, @Res() response: Response) {
    return this.roleService.addModerator(dto, response);
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
  @Put("/updateModeratorControls")
  updateModeratorControls(
    @Body() dto: updateModeratorControls,
    @Res() response: Response
  ) {
    return this.roleService.updateModeratorControls(dto, response);
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
  @Post("/addModeratorWithEmail")
  addModeratorWithEmail(
    @Body() dto: AddModeratorWithEmailDto,
    @Res() response: Response
  ) {
    return this.roleService.addModeratorWithEmail(dto, response);
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
  @Delete("/removerole/:id")
  removeRole(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.roleService.removeRole(id, response);
  }

  //=======================The End=================================
}
