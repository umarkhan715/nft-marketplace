import { Controller, Get, Render, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Root")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  @Render("index")
  root() {
    return { message: "Hello From Server!!!" };
  }

  @Get("/logs")
  getServerLog(@Res() res: Response) {
    return this.appService.getServerLog(res);
  }
}
