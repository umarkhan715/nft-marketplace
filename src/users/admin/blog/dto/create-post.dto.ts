import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    type: 'array',
    name: 'postImage',
    items: { type: 'string', format: 'binary' },
    description: 'Image for the blog post.',
  })
  postImage: any;

  @ApiProperty({
    description: 'Title for the post',
    example: 'Bored Ape',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Post Id',
    example: 'null',
  })
  @IsString()
  id: string | null;

  @ApiProperty({
    description: 'Post Description',
    example: 'This is nft collection',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Post Category',
    example: 'NFT',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Post Image URL',
    example: 'null',
  })
  @IsOptional()
  ImageUrl: null | string;
}
