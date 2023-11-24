import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

enum querydata {
  All = "All",
  Solana = "Solana",
  Ethereum = "Ethereum",
  Tokamak = "Tokamak",
  Polygon = "Polygon",
  Cardano = "Cardano",
  Aptos = "Aptos",
  BinanceSmartChain = "Binance Smart Chain",
  WAX = "WAX",
  Cronos = "Cronos",
  NEAR = "NEAR",
  Hedera = "Hedera",
  Moonriver = "Moonriver",
  Algorand = "Algorand",
  TRON = "TRON",
}

enum upcomingData {
  "All" = "All",
  "7Days" = "7 Days",
  "1Month" = "1 Month",
  "3Days" = "3 Month",
  "6Days" = "6 Month",
  "1Year" = "1 Year",
}

export class SearchCalendar {
  @ApiProperty({
    required: true,
    default: 1,
    description: "Page number",
  })
  @IsNumber()
  pageNo: number;
  @ApiProperty({
    required: true,
    default: 10,
    description: "limit number",
  })
  @IsNumber()
  limit: number;

  @ApiProperty({
    required: false,
    description: "Current UserId",
  })
  @IsOptional()
  Userid: string;

  @ApiProperty({
    description: "Selected category",
    example: "All",
  })
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    type: String,
    description: "Launch date and time  2021-01-30T08:30:00Z || null",
    example: "null",
  })
  launchDate: string;

  @ApiProperty({
    description:
      "blockchain should be All || 7 Days || 1 Month || 3 Days || 6 Days ||1 Year",
    example: "All",
    enum: ["All", "7 Days", "1 Month", "3 Month", "6 Month", "1 Year"],
  })
  @IsNotEmpty()
  @IsEnum(upcomingData, {
    message:
      "blockchain should be All || 7 Days || 1 Month || 3 Month || 6 Month ||1 Year",
  })
  Upcoming: upcomingData;

  @ApiProperty({
    description: "Value should be All ||  solana || ethereum",
    example: "All",
    enum: [
      "All",
      "Solana",
      "Ethereum",
      "Tokamak",
      "Polygon",
      "Cardano",
      "Aptos",
      "Binance Smart Chain",
      "WAX",
      "Cronos",
      "NEAR",
      "Hedera",
      "Moonriver",
      "Algorand",
      "TRON",
    ],
  })
  @IsNotEmpty()
  @IsEnum(querydata, {
    message: "blockchain should be solana || ethereum",
  })
  blockchain: querydata;
}
