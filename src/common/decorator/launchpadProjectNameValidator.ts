import { HttpStatus, Injectable } from "@nestjs/common";
import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class launchPadProjectMiddleWare implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { projectname, blockchaintype, blockchaintypeid } = req.headers;

    if (!req.headers.projectname && !req.headers.blockchaintype) {
      return res.status(401).json({
        mgs: "Project name not specified in request headers",
      });
    }

    let isProjectExit = await this.prisma.launchPadProject.findFirst({
      where: {
        name: projectname.toString(),
        blockchainTypeId: blockchaintypeid.toString(),
      },
    });

    if (isProjectExit) {
      if (
        isProjectExit.ipfsUrlImage !== null &&
        isProjectExit.ipfsUrlmetadata !== null
      ) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          mgs: "Project Image and IPFS metadata exists",
        });
      } else {
        let str = req.headers.projectname.toString();

        let name = str.split(" ");
        let projectname = "";
        name.forEach((str) => {
          projectname += str.charAt(0).toUpperCase().toString() + str.slice(1);
        });
        req.headers.projectname = projectname;
        next();
      }
    } else {
      return res.status(401).json({
        mgs: "LaunchPad project Not Found!!!",
      });
    }
  }
}
