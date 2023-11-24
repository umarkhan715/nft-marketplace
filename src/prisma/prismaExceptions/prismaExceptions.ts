import { HttpException, HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Response } from "express";

export class PrismaException extends Prisma.PrismaClientKnownRequestError {
  findprismaexception(
    error: PrismaClientKnownRequestError | HttpException,
    response: Response
  ) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      //console.log("inside prisma exception:1", error);
      if (error.code === "P2025") {
        this.returnResponseOnErrorChecck(
          {
            message: `An operation failed because it depends on one or more records that were required but not found | ${error.meta.cause.toString()}`,
            code: HttpStatus.BAD_REQUEST,
          },
          error,
          response
        );
      } else if (error.code === "P2003") {
        this.returnResponseOnErrorChecck(
          {
            message: `Foreign key constraint failed on the field:${error.meta.field_name.toString()}`,
            code: HttpStatus.BAD_REQUEST,
          },
          error,
          response
        );
      } else if (error.code === "P2002") {
        this.returnResponseOnErrorChecck(
          {
            message: `Unique constraint failed on the :${error.meta.target}`,
            code: HttpStatus.BAD_REQUEST,
          },
          error,
          response
        );
      }
    } else if (error instanceof HttpException) {
      this.returnResponseOnErrorChecck(null, error, response);
    } else {
      this.returnResponseOnErrorChecck(null, error, response);
    }
  }

  returnResponseOnErrorChecck(
    message: { message: string; code: any } | null,
    error: Prisma.PrismaClientKnownRequestError | any,
    response: Response
  ) {
    // console.log("inside 2", error);
    if (message) {
      console.log(message);
      return response.status(message.code).json(message);
    } else {
      console.log(error);
      return response.status(error.status).json({
        message: error.message,
        code: error.status,
      });
    }
  }
}
