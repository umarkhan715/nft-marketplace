import { PartialType } from '@nestjs/swagger';
import { CreateSolGeneratorDto } from './create-sol-generator.dto';

export class UpdateSolGeneratorDto extends PartialType(CreateSolGeneratorDto) {}
