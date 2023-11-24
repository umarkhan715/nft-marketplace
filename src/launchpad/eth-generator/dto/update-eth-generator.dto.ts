import { PartialType } from '@nestjs/swagger';
import { CreateEthGeneratorDto } from './create-eth-generator.dto';

export class UpdateEthGeneratorDto extends PartialType(CreateEthGeneratorDto) {}
