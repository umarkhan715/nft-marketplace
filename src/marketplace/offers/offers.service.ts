import { Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(private readonly db: PrismaService) {}

  // Create offer
  async createoffer(createOfferDto: CreateOfferDto) {
    try {
      const offerCreated = await this.db.marketplaceOffer.create({
        data: {
          time: createOfferDto.time,
          amount: createOfferDto.amount,
          coinAddress: createOfferDto.coinAddress,
          marketplaceCollectionId: createOfferDto.marketPlaceCollectionId,
          offerAccepted: createOfferDto.offerAccepted,
          isactive: createOfferDto.isactive,
          walletAddress: createOfferDto.walletAddress,
          marketplaceNftId: createOfferDto.marketplaceNftId,
        },
      });
      if (offerCreated) {
        return offerCreated;
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
  // Find all offers
  async findalloffers() {
    try {
      const allOffers = await this.db.marketplaceOffer.findMany({});
      if (allOffers) {
        return allOffers;
      } else {
        throw new HttpException('Not found!!!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      return error;
    }
  }
  // Find single offer by id
  async findoneoffer(offerid: string) {
    try {
      const offer = await this.db.marketplaceOffer.findUnique({
        where: {
          id: offerid,
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

  // Disble offer by id
  async deleteoffer(offerid: string) {
    try {
      const offer = await this.db.marketplaceOffer.update({
        where: {
          id: offerid,
        },
        data: {
          isactive: false,
        },
      });
      if (offer) {
        return offer;
      } else {
        throw new HttpException('Not deleted!!!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      return error;
    }
  }
}
