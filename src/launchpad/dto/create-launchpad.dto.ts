import { ApiHeader, ApiHeaders, ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  isNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class UploadImageMetadatLaunchpadto_IPFS_Dto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  launchPadProjectId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @ApiProperty({
    description: "Flag indicating if you are uploading  Jsonfile of Attributes",
    enum: [true, false],
    default: false,
  })
  @IsString()
  jsonFile: string;

  @ApiProperty({
    type: "array",
    name: "Image",
    items: { type: "string", format: "binary" },
    description: "Image for Launchpad",
  })
  Image: any;
  @ApiProperty({
    type: "array",
    name: "MetaData",
    items: { type: "string", format: "binary" },
    description: "MetaData for Launchpad || for Single Json File",
    required: false,
  })
  MetaData: any;

  @ApiProperty({
    description: "MetaData for LaunchPad in String form",
    required: false,
  })
  @IsString()
  data: string;
}

export class CreateLaunchpadDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  blockchainTypeId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total_quantity: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  twitter_link: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  discord_link: string;

  @ApiProperty({
    type: "array",
    name: "profileImage",
    items: { type: "string", format: "binary" },
    description: "Profile Image for Launchpad",
  })
  profileImage: any;

  @ApiProperty({
    type: "array",
    name: "bannerImage",
    items: { type: "string", format: "binary" },
    description: "banner Image for Launchpad",
  })
  bannerImage: any;
}

export class SingleLaunchpadQuery {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsString()
  @IsOptional()
  blockchainTYpeId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  projectname: string;
}

export class LaunchpadQuery {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsString()
  @IsOptional()
  blockchainTYpeId: string;
}

export class UpdateBlockContractAddressDto {
  @ApiProperty({ description: "LaunchPad Project Id" })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  launchPadProjectId: string;

  @ApiProperty({ description: "User Id of launchPad Creater" })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userid: string;

  @ApiProperty({ description: "BlockChain Type" })
  @IsNotEmpty()
  @IsString()
  blockChainType: string;

  @ApiProperty({ description: "Solana Contract Address" })
  @IsOptional()
  @IsString()
  solanaContractAddress: string;

  @ApiProperty({ description: "Presale Contract Address" })
  @IsOptional()
  @IsString()
  preSaleContractAddress: string;

  @ApiProperty({ description: "Public Contract Address" })
  @IsOptional()
  @IsString()
  publicSaleContractAddress: string;
}

enum queryprojecttype {
  Ethreum = "Ethreum",
  Solana = "Solana",
  Tokamark = "Tokamark",
  All = "All",
}

export class UserProjectQuery {
  @ApiProperty({ required: true })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    required: true,
    enum: ["Ethreum", "Solana", "Tokamark", "All"],
  })
  @IsString()
  @IsNotEmpty()
  BlockChainType: queryprojecttype;
}
