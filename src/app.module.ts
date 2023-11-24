import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from "@nestjs/common";
import { join } from "path";
import { HttpModule } from "@nestjs/axios";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { RouterModule, Route } from "nest-router";
import { PrismaModule } from "./prisma/prisma.module";
import { MulterModule } from "@nestjs/platform-express";
import * as redisStore from "cache-manager-redis-store";
import { UsersModule } from "./users/user/users.module";
import { SocketsGateway } from "./utils/sockets.gateway";
import { AdminModule } from "./users/admin/admin.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { BlogModule } from "./users/admin/blog/blog.module";
import { RoleModule } from "./users/admin/role/role.module";
import { CalendarModule } from "./calendar/calendar.module";
import { LoggerMiddleware } from "./utils/logger.middleware";
import { LaunchpadModule } from "./launchpad/launchpad.module";
import { OrderModule } from "./marketplace/order/order.module";
import { SharedApiModule } from "./shared-api/shared-api.module";
import { SendgridService } from "./EmailService/sendGrid.service";
import { BadgesModule } from "./users/admin/badges/badges.module";
import { SearchModule } from "./marketplace/search/search.module";
import { OffersModule } from "./marketplace/offers/offers.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { BiddingModule } from "./marketplace/bidding/bidding.module";
import { AuctionModule } from "./marketplace/auction/auction.module";
import { SettingsModule } from "./users/admin/settings/settings.module";
import { ToolsModule } from "./users/admin/settings/tools/tools.module";
import { DbConnectionModule } from "./db-connection/db-connection.module";
import { DashboardModule } from "./users/admin/dashboard/dashboard.module";
import { TicketsModule } from "./users/admin/settings/tickets/tickets.module";
import { NftBulkSenderModule } from "./nft-bulk-sender/nft-bulk-sender.module";
import { EthMdRankModule } from "./marketplace/eth-md-rank/eth-md-rank.module";
import { SolMdRankModule } from "./marketplace/sol-md-rank/sol-md-rank.module";
import { FontModule } from "./users/admin/settings/theme-setting/font/font.module";
import { EthGeneratorModule } from "./launchpad/eth-generator/eth-generator.module";
import { SolGeneratorModule } from "./launchpad/sol-generator/sol-generator.module";
import { ColorsModule } from "./users/admin/settings/theme-setting/colors/colors.module";
import { HelpCenterModule } from "./users/admin/settings/help-center/help-center.module";
import { ButtonModule } from "./users/admin/settings/theme-setting/button/button.module";
import { SiteSettingModule } from "./users/admin/settings/site-setting/site-setting.module";
import { ThemeSettingModule } from "./users/admin/settings/theme-setting/theme-setting.module";

@Module({
  imports: [
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../"),
    }),
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbConnectionModule,
    CalendarModule,
    MulterModule.register({
      dest: "./public",
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: "localhost",
    //   port: 6379,
    // }),
    MarketplaceModule,
    EventEmitterModule.forRoot({
      delimiter: ".",
    }),

    RouterModule.forRoutes([
      {
        path: "/server",
        module: AppModule,
      },
      {
        path: "/users",
        module: UsersModule,
      },
      {
        path: "/calendar",
        module: CalendarModule,
      },
      {
        path: "/nftbulksender",
        module: NftBulkSenderModule,
      },
      {
        path: "/launchpad",
        module: LaunchpadModule,
        children: [
          {
            path: "/eth-generator",
            module: EthGeneratorModule,
          },
          {
            path: "/sol-generator",
            module: SolGeneratorModule,
          },
        ],
      },
      {
        path: "/common",
        module: SharedApiModule,
      },
      {
        path: "/marketplace",
        module: MarketplaceModule,
        children: [
          {
            path: "/search",
            module: SearchModule,
          },
          {
            path: "/sol-md-rank",
            module: SolMdRankModule,
          },
          {
            path: "/eth-md-rank",
            module: EthMdRankModule,
          },
          {
            path: "/order",
            module: OrderModule,
          },
          {
            path: "/offers",
            module: OffersModule,
          },
          {
            path: "/bidding",
            module: BiddingModule,
          },
          {
            path: "/auction",
            module: AuctionModule,
          },
        ],
      },
      {
        path: "/admin",
        module: AdminModule,
        children: [
          {
            path: "/badges",
            module: BadgesModule,
          },
          {
            path: "/blog",
            module: BlogModule,
          },
          {
            path: "/dashboard",
            module: DashboardModule,
          },
          {
            path: "/role",
            module: RoleModule,
          },
          {
            path: "/settings",
            module: SettingsModule,
            children: [
              {
                path: "/helpcenter",
                module: HelpCenterModule,
              },
              {
                path: "/tickets",
                module: TicketsModule,
              },
              {
                path: "/site-setting",
                module: SiteSettingModule,
              },
              {
                path: "/tools",
                module: ToolsModule,
              },
              {
                path: "/theme",
                module: ThemeSettingModule,
                children: [
                  {
                    path: "/button",
                    module: ButtonModule,
                  },
                  {
                    path: "/colors",
                    module: ColorsModule,
                  },
                  {
                    path: "/font",
                    module: FontModule,
                  },
                ],
              },
            ],
          },
        ],
      },
    ]),
    SearchModule,
    AuctionModule,
    BiddingModule,
    OrderModule,
    OffersModule,
    EthMdRankModule,
    SolMdRankModule,
    UsersModule,
    AdminModule,
    LaunchpadModule,
    BadgesModule,
    SettingsModule,
    TicketsModule,
    HelpCenterModule,
    RoleModule,
    BlogModule,
    DashboardModule,
    NftBulkSenderModule,
    SharedApiModule,
    EthGeneratorModule,
    SolGeneratorModule,
  ],
  controllers: [AppController],
  providers: [AppService, SendgridService, SocketsGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
