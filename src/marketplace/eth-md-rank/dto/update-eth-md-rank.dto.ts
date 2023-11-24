import { PartialType } from '@nestjs/swagger';
import { CreateEthMdRankDto } from './create-eth-md-rank.dto';

export class UpdateEthMdRankDto extends PartialType(CreateEthMdRankDto) {}
