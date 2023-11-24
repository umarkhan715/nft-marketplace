import { PartialType } from '@nestjs/swagger';
import { CreateSolMdRankDto } from './create-sol-md-rank.dto';

export class UpdateSolMdRankDto extends PartialType(CreateSolMdRankDto) {}
