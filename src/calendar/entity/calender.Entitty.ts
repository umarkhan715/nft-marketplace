import { ApiProperty } from "@nestjs/swagger";
import {
  ArtGallery,
  BlockchainType,
  Calendar,
  CalendarFAQ,
  CalendarLikes,
  CalendarSocialLinks,
  CalendarVote,
  RoadMap,
  SaleType,
  Tags,
  Team,
  User,
} from "@prisma/client";

export class artGalleryEntity implements ArtGallery {
  @ApiProperty() id: string;
  @ApiProperty() path: string;
  @ApiProperty() isactive: boolean;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() calendarId: string;
}

export class socialLink implements CalendarSocialLinks {
  @ApiProperty() id: string;
  @ApiProperty() website: string;
  @ApiProperty() discord: string;
  @ApiProperty() twitter: string;
  @ApiProperty() etherscan: string;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() calendarId: string;
}

export class saletype implements SaleType {
  @ApiProperty() launchPadProjectId: string;
  @ApiProperty() id: string;
  @ApiProperty() type: string;
  @ApiProperty() starttime: Date;
  @ApiProperty() endTime: Date;
  @ApiProperty() price: number;
  @ApiProperty() active: boolean;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() calendarId: string;
}

export class calendarTeamEntity implements Team {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() role: string;
  @ApiProperty() description: string;
  @ApiProperty() profileImage: string;
  @ApiProperty() profileLink: string;
  @ApiProperty() discordLink: string;
  @ApiProperty() LinkedIn: string;
  @ApiProperty() twitter: string;
  @ApiProperty() calendarId: string;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
}
export class CalendarEntity implements Calendar {
  @ApiProperty() overview: string;
  @ApiProperty() featured: boolean;
  @ApiProperty() verifields: boolean;
  @ApiProperty() totalSupply: number;
  @ApiProperty() userId: string;
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() profileImage: string;
  @ApiProperty() bannerImage: string;
  @ApiProperty() calendarGif: string;
  @ApiProperty() description: string;
  @ApiProperty() blockchainTypeId: string;
  @ApiProperty() category: string;
  @ApiProperty() status: string;
  @ApiProperty() launchDate: string;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() user: User;
  @ApiProperty() ArtGallery: ArtGallery;
  @ApiProperty() CalendarFAQ: CalendarFAQ;
  @ApiProperty() like: number;
  @ApiProperty() islike: boolean;
  @ApiProperty() CalendarSocialLinks: CalendarSocialLinks;
  @ApiProperty() CalendarVote: CalendarVote;
  @ApiProperty() RoadMap: RoadMap;
  @ApiProperty() SaleType: SaleType;
  @ApiProperty() Tags: Tags;
  @ApiProperty() Team: Team;
}

export class CalenderLikeEntity {
  @ApiProperty() islike: boolean;
}

export class CalenderArtGallery {
  @ApiProperty() calendarGif: string;
  @ApiProperty() artGallery: artGalleryEntity;
}

export class CalenderArtGalleryEntity {
  @ApiProperty() data: CalenderArtGallery;
}

export class AddTagCalenderEntity {
  @ApiProperty() success: boolean;
  @ApiProperty() addedTags: number;
}

export class CalendarSocialLinksEntity {
  @ApiProperty() data: socialLink;
  @ApiProperty() message: string;
  @ApiProperty() success: boolean;
}

export class CalendarSaleTypeEnity {
  @ApiProperty() data: saletype;
  @ApiProperty() message: string;
  @ApiProperty() success: true;
}

export class calendarDeleteTeamEntity {
  @ApiProperty() success: boolean;
  @ApiProperty() status: number;
}

export class calendarDeleteSaleTypeEntity {
  @ApiProperty() success: true;
  @ApiProperty() message: string;
}

export class calendarDeleteTagsEntity {
  @ApiProperty() success: boolean;
  @ApiProperty() message: string;
}

export class CalendarRoadmapEntity {
  @ApiProperty() success: boolean;
  @ApiProperty() message: string;
}
export class CalendarFAQDeleteEntity {
  @ApiProperty() success: boolean;
  @ApiProperty() mesaage: string;
}

export class blockchainTypes {
  @ApiProperty() id: string;
  @ApiProperty() blockChainName: string;
  @ApiProperty() blockChainIcon: string;
  @ApiProperty() calendars: number;
}
