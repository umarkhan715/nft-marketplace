import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchService } from "./search.service";
@ApiTags("MarketPlace/Search & Filters")
@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("/global")
  //@UseInterceptors(CacheInterceptor)
  //@CacheKey('query')
  @CacheTTL(0)
  globalSearch(@Query() query: Object) {
    return this.searchService.globalSearch(query);
  }

  @Get("/traits")
  getTrait(@Query() query: Object) {
    return this.searchService.getTrait(query);
  }

  @Get("/filters")
  marketPlacefilter(@Query() query: Object) {
    return this.searchService.marketPlacefilter(query);
  }

  @Get("/")
  attributeSearch(@Query() query: Object) {
    return this.searchService.attributeSearch(query);
  }
}
