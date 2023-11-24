import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy, RefreshTokenStrategy } from "./strategy";
import { JwtService } from "@nestjs/jwt";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    JwtStrategy,
    RefreshTokenStrategy,
    JwtService,
  ],
  imports: [PrismaModule],
})
export class UsersModule {}
