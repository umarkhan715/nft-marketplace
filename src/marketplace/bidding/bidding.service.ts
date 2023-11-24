import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBiddingDto } from './dto/create-bidding.dto';
import { UpdateBiddingDto } from './dto/update-bidding.dto';

@Injectable()
export class BiddingService {
  constructor(private readonly db: PrismaService) {}

  // create bidding
  async createbidding(createBiddingDto: CreateBiddingDto) {
    try {
      const BidCreated = await this.db.marketplaceBidding.create({
        data: {
          coinAddress: createBiddingDto.coinAddress,
          highestBid: createBiddingDto.highestBid,
          highestBidder: createBiddingDto.highestBidder,
          marketPlaceAuctionId: createBiddingDto.marketplaceAuctionId,
          walletAddress: createBiddingDto.caller,
        },
      });
      if (BidCreated) {
        return BidCreated;
      } else {
        throw new HttpException(
          'Something Went Wroung!!',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      return error;
    }
  }
  // find all bids in collection
  async findAllBids() {
    try {
      const allbids = await this.db.marketplaceBidding.findMany({});
      if (allbids) {
        return allbids;
      } else {
        throw new HttpException('Not found!!!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      return error;
    }
  }
  // find single bid in colllection
  async findBid(bidId: string) {
    try {
      const offer = await this.db.marketplaceBidding.findUnique({
        where: {
          id: bidId,
        },
      });
      if (offer) {
        return offer;
      } else {
        throw new HttpException('Not found!!!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      return error;
    }
  }
  // update single bid in collection
  async update(bidId: string, updateBiddingDto: UpdateBiddingDto) {
    try {
      const isBidUpdated = await this.db.marketplaceBidding.update({
        where: {
          id: bidId,
        },
        data: {
          coinAddress: updateBiddingDto.coinAddress,
          highestBid: updateBiddingDto.highestBid,
          highestBidder: updateBiddingDto.highestBidder,
          marketPlaceAuctionId: updateBiddingDto.marketplaceAuctionId,
          walletAddress: updateBiddingDto.caller,
        },
      });

      if (isBidUpdated) {
        return isBidUpdated;
      } else {
        throw new HttpException('Bid Not Updated!!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      return error;
    }
  }
  // delete sigle bid in collection
  async deleteBid(bidId: string) {
    try {
      const isBidDeleted = await this.db.marketplaceBidding.delete({
        where: {
          id: bidId,
        },
      });
      if (isBidDeleted) {
        return isBidDeleted;
      } else {
        throw new HttpException('Bid Not Deleted!!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      return error;
    }
  }

}
