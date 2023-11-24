import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  AuctionCreatedEvent,
  BidCreatedEvent,
  OfferCreatedEvent,
  OrderCreatedEvent,
} from "./entity/eventsEntity";

@Injectable()
export class EventsService {
  constructor(private readonly db: PrismaService) {}
  //calling events
  //================================================================================================
  async find_nft_Uid_By_CollectionReference(tokenid: number) {
    try {
      let foundNft = await this.db.marketplaceNft.findFirst({
        where: {
          imgTokenId: tokenid,
        },
        include: {
          marketplaceCollection: true,
        },
      });
      if (foundNft) {
        return foundNft;
      } else {
        throw new HttpException("Not Found", 404);
      }
    } catch (error) {
      return error;
    }
  }

  async create(order: OrderCreatedEvent) {
    try {
      const foundNft = await this.find_nft_Uid_By_CollectionReference(
        parseInt(order.tokenId)
      );
      const isOrderCreated = await this.db.marketplaceOrder.create({
        data: {
          walletAddress: order.caller,
          marketplaceNftId: foundNft.id,
          tokenId: order.tokenId,
          ethPrice: order.ethPrice,
          tokenPrice: order.tokenPrice,
          coinAddress: order.coinAddress,
          marketplaceCollectionId: foundNft.marketplaceCollection.id,
          signature: order.signature,
          createdTime: order.createdTime,
          tokenAmount: order.tokenAmount,
          tokenAddress: order.tokenAddress,
          transactionHash: order.transactionHash,
        },
      });

      if (isOrderCreated) {
        return isOrderCreated;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // Auction events

  async handleAuctionCreatedByToken(payload: AuctionCreatedEvent) {
    try {
      const foundNft = await this.find_nft_Uid_By_CollectionReference(
        parseInt(payload.marketplaceNftId)
      );
      if (foundNft) {
        const isAuctionUpdated = await this.db.marketplaceAuction.create({
          data: {
            tokenId: payload.tokenId,
            minBid: payload.minBid,
            expiryTime: payload.expiryTime,
            signature: payload.signature,
            tokenAddress: payload.tokenAddress,
            coinAddress: payload.coinAddress,
            createdTime: payload.createdTime,
            tokenAmount: payload.tokenAmount,
            walletAddress: payload.walletAddress,
            marketplaceNftId: foundNft.id,
          },
        });
        if (isAuctionUpdated) {
          // console.log('Auction Created by token :success');
          return true;
        } else {
          // console.log('Auction Created by token :failure');
          return false;
        }
      }
    } catch (error) {
      // console.log(error.message);
    }
  }

  async handleAuctionCreatedByEth(payload: AuctionCreatedEvent) {
    try {
      const foundNft = await this.find_nft_Uid_By_CollectionReference(
        parseInt(payload.marketplaceNftId)
      );
      if (foundNft) {
        const isAuctionCreated = await this.db.marketplaceAuction.create({
          data: {
            tokenId: payload.tokenId,
            minBid: payload.minBid,
            expiryTime: payload.expiryTime,
            signature: payload.signature,
            tokenAddress: payload.tokenAddress,
            coinAddress: payload.coinAddress,
            createdTime: payload.createdTime,
            tokenAmount: payload.tokenAmount,
            walletAddress: payload.walletAddress,
            marketplaceNftId: foundNft.id,
          },
        });

        if (isAuctionCreated) {
          // console.log('Auction Created by eth: success');
          return true;
        } else {
          // console.log('Auction Created by eth: failure');
          return false;
        }
      }
    } catch (error) {
      // console.log(error.message);
    }
  }

  // BID Events
  async handleBidByEth(payload: BidCreatedEvent) {
    try {
      const foundNft = await this.find_nft_Uid_By_CollectionReference(
        parseInt(payload.marketplaceNftId)
      );

      if (foundNft) {
        await this.db.marketplaceAuction.update({
          where: {
            id: foundNft.marketplaceAuction[0].id,
          },
          data: {
            minBid: payload.highestBid,
          },
        });

        const isAuctionUpdated = await this.db.marketplaceBidding.create({
          data: {
            marketPlaceAuctionId: foundNft.marketplaceAuction[0].id,
            BidType: "ByEth",
            highestBid: payload.highestBid,
            highestBidder: payload.highestBidder,
            walletAddress: payload.caller,
          },
        });

        if (isAuctionUpdated) {
          // console.log('bid by Eth :success');
          return true;
        } else {
          // console.log('bid by Eth :failure');
          return false;
        }
      } else {
        throw new HttpException("auctionId not exist", 404);
      }
    } catch (error) {
      // console.log(error.message);
    }
  }

  async handleBidByToken(payload: BidCreatedEvent) {
    try {
      const foundNft = await this.find_nft_Uid_By_CollectionReference(
        parseInt(payload.marketplaceNftId)
      );

      if (foundNft) {
        await this.db.marketplaceAuction.update({
          where: {
            id: foundNft.marketplaceAuction[0].id,
          },
          data: {
            minBid: payload.highestBid,
          },
        });

        const isAuctionUpdated = await this.db.marketplaceBidding.create({
          data: {
            marketPlaceAuctionId: foundNft.marketplaceAuction[0].id,
            BidType: "ByToken",
            coinAddress: payload.coinAddress,
            highestBid: payload.highestBid,
            highestBidder: payload.highestBidder,
            walletAddress: payload.caller,
          },
        });

        if (isAuctionUpdated) {
          // console.log('bid by Token :success');
          return true;
        } else {
          // console.log('bid by Token :failure');
          return false;
        }
      } else {
        throw new HttpException("auctionId not exist", 404);
      }
    } catch (error) {
      // console.log(error.message);
    }
  }

  async handleBidAccepted(payload: BidCreatedEvent) {
    try {
      const isAuctionCreated = await this.db.marketplaceBidding.update({
        where: {
          highestBid: payload.highestBid,
        },
        data: {
          bidAccepted: true,
        },
      });

      if (isAuctionCreated) {
        // console.log('Bid Accepted :success');
        return true;
      } else {
        // console.log('Bid Accepted :failure');
        return false;
      }
    } catch (error) {
      // console.log(error.message);
    }
  }

  // Offer Events
  async handleOfferMade(payload: OfferCreatedEvent) {
    try {
      const foundNft = await this.find_nft_Uid_By_CollectionReference(
        parseInt(payload.marketplaceNftId)
      );
      if (foundNft) {
        const isofferCreated = await this.db.marketplaceOffer.create({
          data: {
            time: payload.time,
            amount: payload.amount,
            coinAddress: payload.coinAddress,
            marketplaceNftId: foundNft.id,
            walletAddress: payload.caller,
            marketplaceCollectionId: payload.tokenAddress,
          },
        });

        if (isofferCreated) {
          // console.log('Offer Created :success');
          return true;
        } else {
          // console.log('Offer Created :failure');
          return false;
        }
      }
    } catch (error) {
      // console.log(error.toString());
    }
  }

  async handleofferAccepted(payload: OfferCreatedEvent) {
    try {
      const isofferUpdated = await this.db.marketplaceOffer.update({
        where: {
          time: payload.time,
        },
        data: {
          offerAccepted: true,
        },
      });

      if (isofferUpdated) {
        // console.log('Offer Accepted :success');
        return true;
      } else {
        // console.log('Offer Accepted :failure');
        return true;
      }
    } catch (error) {
      // console.log(error.message);
    }
  }
}
