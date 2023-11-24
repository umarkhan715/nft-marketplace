export class Auction {
  tokenId: number;
  minBid: string; // Selling Price
  expiryTime: string;
  createdTime: string;
  tokenAmount: string;
  tokenAddress: string;
  coinAddress: string; // can be eth or any Erc-20 token
  signature: string;
}
