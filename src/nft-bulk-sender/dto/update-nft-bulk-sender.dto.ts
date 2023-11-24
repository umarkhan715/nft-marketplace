import { PartialType } from '@nestjs/swagger';
import { CreateNftBulkSenderDto } from './create-nft-bulk-sender.dto';

export class UpdateNftBulkSenderDto extends PartialType(CreateNftBulkSenderDto) {}
