import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LaunchpadService } from "./launchpad.service";
import {
  CreateLaunchpadDto,
  LaunchpadQuery,
  SingleLaunchpadQuery,
  UpdateBlockContractAddressDto,
  UploadImageMetadatLaunchpadto_IPFS_Dto,
  UserProjectQuery,
} from "./dto/create-launchpad.dto";
import { UpdateLaunchpadDto } from "./dto/update-launchpad.dto";
import { Request, Response } from "express";
import {
  ArtImageValidation,
  ArtImageValidationJsonFile,
} from "src/common/decorator/artGenerationImageValidation";
import { LaunchPadValidator } from "src/common/decorator/launchPadValidator";
import { LaunchpadEntity } from "./entity/launchPad.entity";

@ApiTags("launchpad")
@Controller()
export class LaunchpadController {
  constructor(private readonly launchpadService: LaunchpadService) {}

  //================================================================================================
  @Get("/")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LaunchpadEntity,
  })
  findByProjectName(
    @Query() query: SingleLaunchpadQuery,
    @Res() response: Response
  ) {
    return this.launchpadService.findByProjectName(query, response);
  }

  //================================================================================================
  @Patch("/update")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(LaunchPadValidator)
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LaunchpadEntity,
  })
  UpdateLaunchPadProject(
    @UploadedFiles() file: Express.Multer.File,
    @Body()
    dto: UpdateLaunchpadDto,
    @Res() response: Response
  ) {
    return this.launchpadService.updateLaunchPadProject(file, dto, response);
  }

  //================================================================================================
  @Get("/userprojects")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [LaunchpadEntity],
  })
  getuserLaunchPadProject(
    @Query() query: UserProjectQuery,
    @Res() response: Response
  ) {
    return this.launchpadService.getuserLaunchPadProject(query, response);
  }
  //================================================================================================
  @Post("/create")
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LaunchpadEntity,
  })
  @UseInterceptors(LaunchPadValidator)
  create(
    @UploadedFiles() file: Express.Multer.File,
    @Body()
    createLaunchPaddto: CreateLaunchpadDto,
    @Res() response: Response
  ) {
    return this.launchpadService.createLaunchpadProject(
      createLaunchPaddto,
      file,
      response
    );
  }

  //================================================================================================

  @ApiHeader({
    name: "projectname",
    description: "Launchpad Project Name",
    required: true,
  })
  @ApiHeader({
    name: "blockchaintype",
    description: "Launchpad Project Blockchain Type",
    required: true,
  })
  @ApiHeader({
    name: "blockchainTypeId",
    description: "Launchpad Project blockchainTypeId",
    required: true,
  })
  @Post("/upload")
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LaunchpadEntity,
  })
  @UseInterceptors(ArtImageValidationJsonFile)
  UploadMetadataByJsonFile(
    @UploadedFiles() file: Express.Multer.File,
    @Body()
    dto: UploadImageMetadatLaunchpadto_IPFS_Dto,
    @Req() request: Request,
    @Res() response: Response
  ) {
    let files: any = file;
    if (!files.Image) {
      throw new HttpException(
        "Please Uploaded Images",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }
    return this.launchpadService.UploadMetadataByJsonFile(
      dto,
      file,
      response,
      request
    );
  }
  //================================================================================================
  @Get("/single/:launchPadId")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LaunchpadEntity,
  })
  getsingleLaunchPad(
    @Param("launchPadId", new ParseUUIDPipe()) launchPadId: string,
    @Res() response: Response
  ) {
    return this.launchpadService.getsingleLaunchPad(launchPadId, response);
  }

  //================================================================================================
  @Get("/all")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [LaunchpadEntity],
  })
  getAllProject(@Query() query: LaunchpadQuery, @Res() response: Response) {
    return this.launchpadService.getAllProject(query, response);
  }

  //================================================================================================
  @Patch("/blockchain")
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LaunchpadEntity,
  })
  UpdateSolanaContractAddresLaunchPadProject(
    @Body() dto: UpdateBlockContractAddressDto,
    @Res() response: Response
  ) {
    return this.launchpadService.UpdateSalanaProjectContractAddress(
      dto,
      response
    );
  }
}
