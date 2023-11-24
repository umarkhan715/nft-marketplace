import { Module } from "@nestjs/common";
import { SharedApiService } from "./shared-api.service";
import { SharedApiController } from "./shared-api.controller";

@Module({
  controllers: [SharedApiController],
  providers: [SharedApiService],
})
export class SharedApiModule {}
