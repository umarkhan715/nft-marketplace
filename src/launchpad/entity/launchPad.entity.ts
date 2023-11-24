import { ApiProperty } from "@nestjs/swagger";
import { ContractType, launchPadProject } from "@prisma/client";

export class LaunchpadEntity implements launchPadProject {
  @ApiProperty() dimensions: string;
  @ApiProperty() generatedPath: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() isfeatured: boolean;
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() preSaleContractAddress: string;
  @ApiProperty() publicSaleContractAddress: string;
  @ApiProperty() nftquantity: number;
  @ApiProperty() ipfsUrlmetadata: string;
  @ApiProperty() ipfsUrlImage: string;
  @ApiProperty() walletAddress: string;
  @ApiProperty() type: string;
  @ApiProperty() twitterLink: string;
  @ApiProperty() discordLink: string;
  @ApiProperty() solanaContractAddress: string;
  @ApiProperty() profileImage: string;
  @ApiProperty() bannerImage: string;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() contractType: ContractType;
  @ApiProperty() userId: string;
  @ApiProperty() blockchainTypeId: string;
}
