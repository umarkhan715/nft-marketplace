import { Controller, Get, Query, Res } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto, OrderQuery } from "./dto/create-order.dto";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
@ApiTags("Order")
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("/all")
  findAll(@Query() query: OrderQuery, @Res() response: Response) {
    return this.orderService.findAll(query, response);
  }
}
