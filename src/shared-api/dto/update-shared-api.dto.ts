import { PartialType } from '@nestjs/mapped-types';
import { CreateSharedApiDto } from './create-shared-api.dto';

export class UpdateSharedApiDto extends PartialType(CreateSharedApiDto) {}
