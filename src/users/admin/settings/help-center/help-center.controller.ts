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
import { HelpCenterService } from "./help-center.service";
import {
  CreateHelpCenterDto,
  DropDownDto,
  FormFieldDto,
} from "./dto/create-help-center.dto";
import { Response } from "express";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Help Center")
@Controller()
export class HelpCenterController {
  constructor(private readonly helpCenterService: HelpCenterService) {}
  // add option
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Post("/add")
  AddhelpCenterOption(
    @Body() createHelpCenterDto: CreateHelpCenterDto,
    @Res() response: Response
  ) {
    return this.helpCenterService.AddhelpCenterOption(
      createHelpCenterDto,
      response
    );
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
  @Get("/getallparent")
  findAllOptionList(@Res() response: Response) {
    return this.helpCenterService.findAllParentOptionList(response);
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
  @Get("/getalloption")
  findAllParentOptionList(@Res() response: Response) {
    return this.helpCenterService.findAllOptionList(response);
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
  @Get("/getsingleoption/:id")
  findSingleOption(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.helpCenterService.findSingleOption(id, response);
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
  @Delete("/optiondelete/:id")
  deleteoption(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.helpCenterService.deleteoption(id, response);
  }

  // form fields
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Post("/addform")
  addFormFieldToOption(
    @Body() FormFieldDto: FormFieldDto,
    @Res() response: Response
  ) {
    return this.helpCenterService.addFormFieldToOption(FormFieldDto, response);
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
  @Get("/getallforms")
  getallformfield(@Res() response: Response) {
    return this.helpCenterService.getallformfield(response);
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
  @Get("/getsingleformfield/:id")
  getallsingleformfield(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.helpCenterService.getallsingleformfield(id, response);
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
  @Delete("/deletform/:id")
  deleteformfield(@Param("id") id: string, @Res() response: Response) {
    return this.helpCenterService.deleteformfield(id, response);
  }
  // dropdown fields
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @Post("/adddropdown")
  addDropDownToOption(
    @Body() DropDownDto: DropDownDto,
    @Res() response: Response
  ) {
    return this.helpCenterService.addDropDownToOption(DropDownDto, response);
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
  @Get("/getalldropdown")
  getalldropdownfield(@Res() response: Response) {
    return this.helpCenterService.getalldropdownfield(response);
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
  @Get("/getsingledropdownfield/:id")
  getallsingldropdownfield(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.helpCenterService.getallsingldropdownfield(id, response);
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
  @Delete("/deletdropdown/:id")
  deletedropdownfield(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.helpCenterService.deletedropdownfield(id, response);
  }
}
