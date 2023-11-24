import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DbConnectionService } from "src/db-connection/db-connection.service";
import { OrderQuery } from "./dto/create-order.dto";
import { Response } from "express";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
@Injectable()
export class OrderService {
  constructor(private db: DbConnectionService) {}

  async findAll(dto: OrderQuery, response: Response) {
    try {
      let order = await this.db.marketplaceOrder.findMany({
        where: {
          id: dto.orderid ?? undefined,
          tokenId: dto.tokenId ?? undefined,
          tokenAddress: dto.tokenAddress ?? undefined,
          marketplaceNftId: dto.marketplaceNftId ?? undefined,
          ethPrice: dto.ethPrice ?? undefined,
          marketplaceCollectionId: dto.marketplaceCollectionId ?? undefined,
        },
      });
      if (order.length !== 0) {
        return response.status(HttpStatus.OK).json(order);
      } else {
        throw new HttpException("not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
