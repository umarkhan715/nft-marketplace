import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, CreateTicketTypeDto } from './dto/create-ticket.dto';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TicketImageValidator } from './dto/ticketimagevalidations';
import { response, Response } from 'express';
@ApiTags('Tickets')
@Controller()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Post('/add')
  @UseInterceptors(TicketImageValidator)
  addticket(
    @Body() createTicketDto: CreateTicketDto,
    @UploadedFiles() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    return this.ticketsService.addticket(createTicketDto, file, response);
  }

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Get('/all')
  findAllTicket(@Res() response: Response) {
    return this.ticketsService.findAllTicket(response);
  }

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Get('/single/:id')
  findsingleticket(@Param('id') id: string, @Res() response: Response) {
    return this.ticketsService.findsingleticket(id, response);
  }

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Delete('/delete/:id')
  deleteticket(@Param('id') id: string, @Res() response: Response) {
    return this.ticketsService.deleteticket(id, response);
  }

  // tickets type
  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Post('/types/create')
  @UseInterceptors(TicketImageValidator)
  addticketType(@Body() dto: CreateTicketTypeDto, @Res() response: Response) {
    return this.ticketsService.addticketType(dto, response);
  }

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Get('/ticket')
  findAllTicketType(@Res() response: Response) {
    return this.ticketsService.findAllTicketType(response);
  }

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Get('/type/:id')
  findsingleTicketType(@Param('id') id: string, @Res() response: Response) {
    return this.ticketsService.findsingleTicketType(id, response);
  }

  //===============================================================
  @ApiOkResponse({
    status: 200,
    description: 'OK',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request!!',
  })
  @Delete('/type/:id')
  deleteticketType(@Param('id') id: string, @Res() response: Response) {
    return this.ticketsService.deleteticketType(id, response);
  }

  //=================The End========================================
}
