import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  HttpCode,
  Res,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { BlogImageValidator } from "../../../common/decorator/blogPostImage";
import { BlogService } from "./blog.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Response } from "express";
@ApiTags("Blog")
@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: "OK",
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "Bad Request!!",
  })
  @UseInterceptors(BlogImageValidator)
  @ApiConsumes("multipart/form-data")
  @Post("post")
  createPostInBlog(
    @UploadedFiles() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Res() response: Response
  ) {
    return this.blogService.createPostInBlog(file, createPostDto, response);
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
  @Get("/allpost")
  findAllPost(@Res() response: Response) {
    return this.blogService.findAllPost(response);
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
  @Get("/post/:id")
  findPostById(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.blogService.findPostById(id, response);
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
  @Patch("/update/:id")
  publishPostbyid(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.blogService.publishPostbyid(id, response);
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
  @Delete("/delete/:id")
  deletePostById(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.blogService.deletePostById(id, response);
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
  @Get("/category")
  getallcetorgy(@Res() response: Response) {
    return this.blogService.getblogcategory(response);
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
  @Get("/category/:id")
  getpostbycategory(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Res() response: Response
  ) {
    return this.blogService.getpostbycategory(id, response);
  }
  //===============================================================
}
