import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from "@nestjs/common";
import { SharedApiService } from "./shared-api.service";
import { Response } from "express";
import { ApiBody, ApiParam, ApiProperty, ApiTags } from "@nestjs/swagger";
import {
  CreateMarketplaceDto,
  MarketplaceCollectionDto,
} from "src/marketplace/dto/create-marketplace.dto";
import {
  GlobalSearch,
  MarketPlaceCollectionFilter,
} from "./dto/create-shared-api.dto";
@ApiTags("CommonApi")
@Controller("")
export class SharedApiController {
  constructor(private readonly sharedApiService: SharedApiService) {}

  @Get("/allbloackchain")
  findallBloackchain(@Res() response: Response) {
    return this.sharedApiService.findallBloackchain(response);
  }

  @Get("/getTransactionDetailsTestnet")
  getTransactionDetailsFromTestnet(
    @Query("transactionHash") transactionHash: string,
    @Res() response: Response
  ) {
    return this.sharedApiService.getTransactionDetailsFromGeoriliTestnet(
      transactionHash,
      response
    );
  }

  @Get("/getTransactionDetailsMainnet")
  getTransactionDetailsFromMainnet(
    @Query("transactionHash") transactionHash: string,
    @Res() response: Response
  ) {
    return this.sharedApiService.getTransactionDetailsFromEthriumMainnet(
      transactionHash,
      response
    );
  }

  @Post("/createcollection")
  create(@Body() dto: CreateMarketplaceDto, @Res() response: Response) {
    return this.sharedApiService.createEthCollection(dto, response);
  }

  @Post("/checkcontractnetwork")
  checkcontractnetwork(
    @Body() dto: CreateMarketplaceDto,
    @Res() response: Response
  ) {
    return this.sharedApiService.checkContractNetwork(dto, response);
  }

  @Get("/globalsearch")
  globalsearch(@Query() query: GlobalSearch, @Res() response: Response) {
    return this.sharedApiService.globalsearch(query, response);
  }

  @Post("/collectionfilter")
  marketplaceCollectionFilter(
    @Body() dto: MarketPlaceCollectionFilter,
    @Res() response: Response
  ) {
    return this.sharedApiService.marketplaceCollectionFilter(dto, response);
  }
}
