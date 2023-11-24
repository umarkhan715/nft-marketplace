import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";

@Injectable()
export class AuctionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAuctionDto) {
    try {
      let isCreated = await this.prisma.marketplaceAuction.create({
        data: {
          tokenId: dto.tokenId,
          minBid: dto.minBid,
          expiryTime: dto.expiryTime,
          signature: dto.signature,
          tokenAddress: dto.tokenAddress,
          coinAddress: dto.coinAddress,
          createdTime: dto.createdTime,
          tokenAmount: dto.tokenAmount,
          walletAddress: "",
          marketplaceNftId: "",
        },
      });
      if (isCreated) {
        return isCreated;
      }
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all auction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auction`;
  }

  update(id: number, updateAuctionDto: UpdateAuctionDto) {
    return `This action updates a #${id} auction`;
  }

  remove(id: number) {
    return `This action removes a #${id} auction`;
  }
}
