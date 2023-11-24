import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateNftBulkSenderDto } from "./dto/create-nft-bulk-sender.dto";
import { UpdateNftBulkSenderDto } from "./dto/update-nft-bulk-sender.dto";
import { Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";
@Injectable()
export class NftBulkSenderService {
  constructor(private readonly prisma: PrismaService) {}
}
