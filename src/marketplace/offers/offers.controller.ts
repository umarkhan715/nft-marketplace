import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('MarketPlace/Offer')
@Controller()
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('/create')
  async createoffer(@Body() createOfferDto: CreateOfferDto) {
    return await this.offersService.createoffer(createOfferDto);
  }

  @Get('/')
  //@UseInterceptors(CacheInterceptor)
  //@CacheKey('getalloffer')
  //@CacheTTL(0)
  findalloffers() {
    return this.offersService.findalloffers();
  }

  @Get(':id')
  //@UseInterceptors(CacheInterceptor)
  //@CacheKey('getsingleoffer')
  //@CacheTTL(0)
  findoneoffer(@Param('id') id: string) {
    return this.offersService.findoneoffer(id);
  }

  @Delete(':id')
  deleteoffer(@Param('id') id: string) {
    return this.offersService.deleteoffer(id);
  }
}
