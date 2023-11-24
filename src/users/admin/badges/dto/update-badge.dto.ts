import { PartialType } from '@nestjs/swagger';
import { CreateBadgeDto, LevelDto } from './create-badge.dto';

export class UpdateBadgeDto extends PartialType(CreateBadgeDto) {}

export class UpdateLevelDto extends PartialType(LevelDto) {}
