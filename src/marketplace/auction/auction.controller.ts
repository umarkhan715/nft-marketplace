import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuctionService } from "./auction.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";

ApiTags("MarketPlace/Auction");
@Controller()
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post("create")
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.create(createAuctionDto);
  }

  @Get()
  findAll() {
    return this.auctionService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.auctionService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionService.update(+id, updateAuctionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.auctionService.remove(+id);
  }
}
