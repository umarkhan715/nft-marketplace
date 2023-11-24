import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { DbConnectionModule } from '../../../../db-connection/db-connection.module';

@Module({
  controllers: [ToolsController],
  providers: [ToolsService],
  imports: [DbConnectionModule],
})
export class ToolsModule {}
