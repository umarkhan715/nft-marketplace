import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Response } from 'express';
import {
  SettingFAQsDto,
  SettingCategoryDto,
  SubscriptionDto,
} from './dto/create-setting.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Setting')
@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // FAQs routes
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Post('/faqs')
  createfaqs(
    @Body() settingFAQsDto: SettingFAQsDto,
    @Res() response: Response,
  ) {
    return this.settingsService.createfaqs(settingFAQsDto, response);
  }
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Get('/faqs')
  findAllFAQs(@Res() response: Response) {
    return this.settingsService.findAllFAQs(response);
  }
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Delete('/faqs/:id')
  deleteFAQs(@Param('id') id: string, @Res() response: Response) {
    return this.settingsService.deleteFAQs(id, response);
  }

  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Get('/faqs/:id')
  findsinglefaqs(@Param('id') id: string, @Res() response: Response) {
    return this.settingsService.findsinglefaqs(id, response);
  }

  // Setting Category routes
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Post('/category')
  createcategory(
    @Body() settingCategoryDto: SettingCategoryDto,
    @Res() response: Response,
  ) {
    return this.settingsService.createcategory(settingCategoryDto, response);
  }
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Get('/category')
  findAllCategory(@Res() response: Response) {
    return this.settingsService.findAllCategory(response);
  }
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Delete('/category/:id')
  deletecategory(@Param('id') id: string, @Res() response: Response) {
    return this.settingsService.deletecategory(id, response);
  }
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Get('/category/:id')
  findsinglecategory(@Param('id') id: string, @Res() response: Response) {
    return this.settingsService.findsinglecategory(id, response);
  }

  // Subscription routes
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Post('/subscription')
  Subscription(
    @Body() SubscriptionDto: SubscriptionDto,
    @Res() response: Response,
  ) {
    return this.settingsService.Subscription(SubscriptionDto, response);
  }
  //========================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Get('get-all-site-settings')
  getallSiteSetting(@Res() response: Response) {
    return this.settingsService.getAllSite(response);
  }
}
