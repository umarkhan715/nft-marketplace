import { Module } from "@nestjs/common";
import { MarketplaceService } from "./marketplace.service";
import { MarketplaceController } from "./marketplace.controller";
import { OffersModule } from "./offers/offers.module";
import { BiddingModule } from "./bidding/bidding.module";
import { DbConnectionModule } from "../db-connection/db-connection.module";
import { SearchModule } from "./search/search.module";
import { EthMdRankModule } from "./eth-md-rank/eth-md-rank.module";
import { SolMdRankModule } from "./sol-md-rank/sol-md-rank.module";

import { OrderModule } from "./order/order.module";
import { AuctionModule } from "./auction/auction.module";

@Module({
  controllers: [MarketplaceController],
  providers: [MarketplaceService],

  imports: [
    DbConnectionModule,
    SearchModule,
    EthMdRankModule,
    SolMdRankModule,
    OrderModule,
    AuctionModule,
  ],
})
export class MarketplaceModule {}
