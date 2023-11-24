import { ApiProperty } from "@nestjs/swagger";

export class CreateSharedApiDto {}

export class transactionHash {
  blockNumber: string;
  from: string;
  gas: string;
  gasPrice: string;
  to: string;
  value: string;
}

export class GlobalSearch {
  @ApiProperty({
    description: "Search 2Rare Marketplace",
  })
  query: string;
}

export class MarketPlaceCollectionFilter {
  @ApiProperty({})
  attribute: string;

  @ApiProperty({})
  sort: boolean;

  @ApiProperty({})
  collectionAddress: string;

  @ApiProperty({})
  pageNo: number;

  @ApiProperty({})
  limit: number;
}
