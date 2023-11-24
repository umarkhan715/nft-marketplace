import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  CacheInterceptor,
  CacheKey,
  Query,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { MarketplaceService } from "./marketplace.service";
import {
  CreateMarketplaceDto,
  MarketplaceCollectionDto,
} from "./dto/create-marketplace.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CreateMarketplaceSolDto } from "./dto/marketplace-sol-Collection.dto";
import {
  marketpalceNftdto,
  querymarketplaceDTO,
} from "./dto/query-marketplace.dto";
import { wishListmarketplaceDTO } from "./dto/wishList-marketplace.dto";
import { watchListmarketplaceDTO } from "./dto/watchList-marketplace.dto";
import { Validate } from "class-validator";

@ApiTags("MarketPlace")
@Controller()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("add-eth-collection")
  createEthCollection(@Body() createMarketplaceDto: CreateMarketplaceDto) {
    return this.marketplaceService.createEthCollection(createMarketplaceDto);
  }

  @Post("add-sol-collection")
  createSolCollection(@Body() createMarketplaceDto: CreateMarketplaceSolDto) {
    // return this.marketplaceService.createSolCollection(createMarketplaceDto);
  }

  @Get("fetch_all_record")
  findAll() {
    return this.marketplaceService.findAll();
  }

  @Get("/")
  marketplaceCollection(@Query() query: querymarketplaceDTO) {
    return this.marketplaceService.marketplaceCollection(query);
  }

  @Get("/getallcollection")
  getAllCollection(@Res() response: Response) {
    return this.marketplaceService.getAllCollection(response);
  }

  @Get("/getallnft")
  getAllNft(@Query() dto: marketpalceNftdto, @Res() response: Response) {
    return this.marketplaceService.getAllNft(dto, response);
  }

  @Get("/:id")
  getSingleCollection(
    @Param("id") collectionid: string,
    @Res() response: Response
  ) {
    return this.marketplaceService.getSingleCollection(collectionid, response);
  }

  @Delete("/:id")
  deletemarketplaceCollection(
    @Param("id") collectionid: string,
    @Res() response: Response
  ) {
    return this.marketplaceService.deletemarketplaceCollection(
      collectionid,
      response
    );
  }

  @Post("/wishlist")
  async marketplaceWishList(
    @Body() body: wishListmarketplaceDTO,
    @Res() response: Response
  ) {
    let result = await this.marketplaceService.marketplaceWishList(body);

    let split = result.message.split(" ");
    if (split[2] === "added") {
      response.status(HttpStatus.CREATED).send(result);
    }
    if (split[2] === "removed") {
      response.status(HttpStatus.OK).send(result);
    }
  }
  @Post("/watchlist")
  async marketplaceWatchList(
    @Body() body: watchListmarketplaceDTO,
    @Res() response: Response
  ) {
    let result = await this.marketplaceService.marketplaceWatchList(body);

    let split = result.message.split(" ");
    if (split[2] === "added") {
      response.status(HttpStatus.CREATED).send(result);
    }
    if (split[2] === "removed") {
      response.status(HttpStatus.OK).send(result);
    }
  }

  @Post("/createcollection")
  create(@Body() dto: MarketplaceCollectionDto) {
    return this.marketplaceService.createCollection(dto);
  }
}
