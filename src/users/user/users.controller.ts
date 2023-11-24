import {
  Controller,
  Post,
  Body,
  Logger,
  Get,
  UseGuards,
  Param,
  Patch,
  UploadedFiles,
  UseInterceptors,
  Res,
  Bind,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateAuthDto, SubcriptionsDto } from "./dto/create-auth.dto";
import { JwtGuard, RefreshTokenGuard } from "./guard/jwt.guard";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiHeaders,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import { Response, Request } from "express";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { updateuserprofileImages } from "../../common/decorator/updateuserprofileImages";
import {
  SubcriptionsEntity,
  token,
  UpsertUserEntity,
  UserDeleteBlockEntity,
  UserEntity,
} from "./Entity/user.entity";

@ApiTags("User")
@ApiBadRequestResponse({
  status: 400,
  description: "Bad Request!!",
})
@ApiNotFoundResponse({
  status: 404,
  description: "Not Found!!",
})
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name);

  //========================================================
  @Post("/")
  @ApiCreatedResponse({
    status: 201,
    description: "Created",
    type: UpsertUserEntity,
  })
  async create(
    @Body() createUserDto: CreateAuthDto,
    @Res() response: Response
  ) {
    return this.usersService.create(createUserDto, response);
  }
  //========================================================
  @UseGuards(RefreshTokenGuard)
  @ApiSecurity("Refresh-AUTH")
  @Post("refreshToken")
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: token,
  })
  refreshtoken(@Req() request: Request, @Res() response: Response) {
    return this.usersService.getrefreshtoken(request, response);
  }

  //========================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: UserEntity,
  })
  @ApiSecurity("JWT-AUTH")
  @UseGuards(JwtGuard)
  @Get("wallet/:id")
  getuserbywalletAddress(
    @Param("id") walletAddress: string,
    @Res() response: Response
  ) {
    return this.usersService.getuserbywalletAddress(walletAddress, response);
  }
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: UserEntity,
  })
  @ApiConsumes("multipart/form-data")
  @Post("update")
  @UseInterceptors(updateuserprofileImages)
  updateuserprofile(
    @UploadedFiles() file: Express.Multer.File,
    @Body() dto: UpdateAuthDto,
    @Res() response: Response
  ) {
    return this.usersService.updateuserprofile(file, dto, response);
  }
  //========================================================

  @ApiSecurity("JWT-AUTH")
  @UseGuards(JwtGuard)
  @Get("/details/:id")
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: UserEntity,
  })
  getUserDetails(
    @Param("id", new ParseUUIDPipe()) userId: string,
    @Res() response: Response
  ) {
    return this.usersService.getUserDetails(userId, response);
  }
  //========================================================
  @Patch("/delete/:id")
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: UserDeleteBlockEntity,
  })
  deleteuserfromdb(
    @Param("id", new ParseUUIDPipe()) userId: string,
    @Res() response: Response
  ) {
    return this.usersService.deleteuserfromdb(userId, response);
  }
  //========================================================
  @Patch("/block/:id")
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: UserDeleteBlockEntity,
  })
  bloackuserfromdb(
    @Param("id", new ParseUUIDPipe()) userId: string,
    @Res() response: Response
  ) {
    return this.usersService.bloackuserfromdb(userId, response);
  }
  //========================================================
  @Get("/allusers")
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: [UserEntity],
  })
  getalluser(@Res() response: Response) {
    return this.usersService.getalluser(response);
  }
  //========================================================
  @Post("/subcriptions")
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: SubcriptionsEntity,
  })
  createUserSubscription(
    @Body() dto: SubcriptionsDto,
    @Res() response: Response
  ) {
    return this.usersService.createUserSubscription(dto, response);
  }
  //========================================================
  @Get("/allsubcriptions")
  @ApiOkResponse({
    status: 200,
    description: "OK",
    type: [SubcriptionsEntity],
  })
  unSubscribeUser(@Res() response: Response) {
    return this.usersService.allsubcription(response);
  }
  //=========================END============================//
}
