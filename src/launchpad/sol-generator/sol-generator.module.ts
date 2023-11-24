import { Module } from '@nestjs/common';
import { SolGeneratorService } from './sol-generator.service';
import { SolGeneratorController } from './sol-generator.controller';
import { DbConnectionModule } from '../../db-connection/db-connection.module';
@Module({
  controllers: [SolGeneratorController],
  providers: [SolGeneratorService],
  imports: [DbConnectionModule],
})
export class SolGeneratorModule {}
