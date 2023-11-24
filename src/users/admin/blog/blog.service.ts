import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { Response } from "express";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class BlogService {
  constructor(
    private readonly db: PrismaService,
    private readonly config: ConfigService
  ) {}

  async createPostInBlog(
    files: Express.Multer.File,
    createPostDto: CreatePostDto,
    response: Response
  ) {
    try {
      let _imageUrl = "";
      let images: any = files;
      if (images.postImage) {
        const { postImage } = images;
        _imageUrl = `${this.config.get("DEPLOY_URL")}/${postImage[0].path}`;
      }

      let Post = await this.db.blogPost.upsert({
        where: { id: createPostDto.id },
        update: {
          title: createPostDto.title,
          description: createPostDto.description,
          imageUrl: createPostDto.ImageUrl,
        },
        create: {
          title: createPostDto.title,
          description: createPostDto.description,
          category: createPostDto.category,
          imageUrl: _imageUrl,
        },
      });
      if (Post) {
        return response.status(200).json({
          data: Post,
          success: true,
        });
      } else {
        throw new HttpException(
          "Something went wroung!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findAllPost(response: Response) {
    try {
      let Posts = await this.db.blogPost.findMany({
        orderBy: {
          created_at: "asc",
        },
      });
      if (Posts) {
        return response.status(200).json({
          data: Posts,
          success: true,
        });
      } else {
        throw new HttpException(
          "Something went wroung!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findPostById(postId: string, response: Response) {
    try {
      let Post = await this.db.blogPost.findUnique({
        where: {
          id: postId,
        },
      });
      if (Post) {
        return response.status(200).json(Post);
      } else {
        throw new HttpException(
          "Something went wroung!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async publishPostbyid(postId: string, response: Response) {
    try {
      let publishStatus = await this.db.blogPost.findUnique({
        where: { id: postId },
      });

      let isPublish = await this.db.blogPost.update({
        where: {
          id: postId,
        },
        data: {
          isPublish: !publishStatus.isPublish,
        },
      });
      if (isPublish) {
        return response.status(200).json(isPublish);
      } else {
        throw new HttpException(
          "Something went wroung!!",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deletePostById(postId: string, response: Response) {
    try {
      let isPostDeleted = await this.db.blogPost.delete({
        where: {
          id: postId,
        },
      });

      if (isPostDeleted) {
        return response.status(200).json({
          data: isPostDeleted,
          success: true,
        });
      } else {
        throw new HttpException("Record not found", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getblogcategory(response: Response) {
    try {
      let category = await this.db.blogPost.findMany({
        select: {
          category: true,
        },
        distinct: ["category"],
      });

      if (category) {
        let data = [];
        category.forEach((element) => {
          data.push(element.category);
        });
        return response.status(200).json(data);
      } else {
        throw new HttpException("Not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getpostbycategory(category: string, response: Response) {
    try {
      let categoryFound = await this.db.blogPost.findMany({
        where: {
          category: {
            contains: category,
            mode: "insensitive",
          },
        },
        orderBy: {
          title: "asc",
        },
      });

      if (categoryFound) {
        return response.status(200).json(categoryFound);
      } else {
        throw new HttpException("Not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
