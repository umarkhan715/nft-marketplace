export class OrderCreatedEvent {
  tokenAddress: string;
  tokenId: string;
  ethPrice: string;
  tokenPrice: string;
  createdTime: string;
  tokenAmount: string;
  caller: string;
  coinAddress: string;
  signature: string;
  transactionHash: string;
}

export class AuctionCreatedEvent {
  marketplaceNftId: string;
  tokenId: number;
  minBid: string;
  signature: string;
  tokenAddress: string;
  tokenAmount: string;
  createdTime: string;
  expiryTime: string;
  coinAddress: string;
  walletAddress: string;
}

export class BidCreatedEvent {
  tokenAddress: string;
  marketplaceNftId: string;
  caller: string;
  highestBid: string;
  highestBidder: string;
  coinAddress: string;
}

export class OfferCreatedEvent {
  tokenAddress: string;
  marketplaceNftId: string;
  time: string;
  amount: string;
  caller: string;
  coinAddress: string;
}
