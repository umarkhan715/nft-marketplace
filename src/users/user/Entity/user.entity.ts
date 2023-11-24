import { ApiProperty } from "@nestjs/swagger";
import {
  Calendar,
  CalendarLikes,
  CalendarVote,
  launchPadProject,
  Role,
  Subscription,
  User,
  UserBadges,
  Wallet,
  WalletType,
  WatchList,
  WishList,
} from "@prisma/client";
export class wallettype implements WalletType {
  @ApiProperty() id: string;
  @ApiProperty() walletType: string;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
}
export class wallet implements Wallet {
  @ApiProperty() walletTypeId: string;
  @ApiProperty() id: string;
  @ApiProperty() walletAddress: string;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() userId: string;
  @ApiProperty() walletypeid: string;
  @ApiProperty() walletType: wallettype;
}

export class role implements Role {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() active: boolean;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
}

export class UserEntity implements User {
  @ApiProperty() id: string;
  @ApiProperty() profileImage: string;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() coverImage: string;
  @ApiProperty() username: string;
  @ApiProperty() discordlink: string;
  @ApiProperty() twitterlink: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() block: boolean;
  @ApiProperty() spendingAmount: number;
  @ApiProperty() refreshToken: string;
  @ApiProperty() roleId: string;
  @ApiProperty() overview: string;
  @ApiProperty() wallets: wallet;
  @ApiProperty() userbadge: UserBadges;
  @ApiProperty() calendarVote: CalendarVote;
  @ApiProperty() calendar: Calendar;
  @ApiProperty() watchList: WatchList;
  @ApiProperty() wishList: WishList;
  @ApiProperty() role: role;
  @ApiProperty() launchpadProject: launchPadProject;
  @ApiProperty() Subscription: Subscription;
  @ApiProperty() calendarlikes: CalendarLikes;
}

export class token {
  @ApiProperty() access_token: string;
  @ApiProperty() refresh_token: string;
}

export class UpsertUserEntity {
  @ApiProperty() token: token;
  @ApiProperty() user: UserEntity;
}

export class UserDeleteBlockEntity {
  @ApiProperty() message: string;
  @ApiProperty() success: true;
}

export class SubcriptionsEntity implements Subscription {
  @ApiProperty() id: string;
  @ApiProperty() subscription: boolean;
  @ApiProperty() created_at: Date;
  @ApiProperty() updated_at: Date;
  @ApiProperty() userId: string;
}
