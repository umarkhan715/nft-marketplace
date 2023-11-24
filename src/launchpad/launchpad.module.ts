import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { LaunchpadService } from "./launchpad.service";
import { LaunchpadController } from "./launchpad.controller";
import { DbConnectionModule } from "../db-connection/db-connection.module";
import { launchPadProjectMiddleWare } from "src/common/decorator/launchpadProjectNameValidator";

@Module({
  controllers: [LaunchpadController],
  providers: [LaunchpadService],
  imports: [DbConnectionModule],
})
export class LaunchpadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(launchPadProjectMiddleWare)
      .forRoutes(
        { path: "/launchpad/upload", method: RequestMethod.POST },
        { path: "/launchpad/uploadjson", method: RequestMethod.POST }
      );
  }
}
