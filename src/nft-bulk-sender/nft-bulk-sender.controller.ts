import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { NftBulkSenderService } from "./nft-bulk-sender.service";
import { CreateNftBulkSenderDto } from "./dto/create-nft-bulk-sender.dto";
import { UpdateNftBulkSenderDto } from "./dto/update-nft-bulk-sender.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ArtImageValidation } from "src/common/decorator/artGenerationImageValidation";
import { Response } from "express";
@ApiTags("NFT Bulk Sender")
@Controller()
export class NftBulkSenderController {
  constructor(private readonly nftBulkSenderService: NftBulkSenderService) {}
}
