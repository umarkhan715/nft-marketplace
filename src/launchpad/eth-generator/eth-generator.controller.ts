import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EthGeneratorService } from "./eth-generator.service";
import { CreateEthGeneratorDto } from "./dto/create-eth-generator.dto";
import { userDto } from "./dto/user-eth.dto";

@ApiTags("LauchPad/Eth-generator")
@Controller()
export class EthGeneratorController {
  constructor(private readonly ethGeneratorService: EthGeneratorService) {}

  @Post("create-art")
  create(@Body() createEthGeneratorDto: CreateEthGeneratorDto) {
    return this.ethGeneratorService.create(createEthGeneratorDto);
  }

  @Get("get-all-collection")
  findAll() {
    return this.ethGeneratorService.findAll();
  }
  @Get("get-collection-name")
  findName() {
    return this.ethGeneratorService.findName();
  }
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ethGeneratorService.findOne(id);
  }
  @Patch("update-user-contract-address")
  updateUserContractAddress(@Body() dto: userDto) {
    return this.ethGeneratorService.storeContractAddress(dto);
  }
  @Get("get-contract-address/:id")
  findContractAddress(@Param("id") id: string) {
    return this.ethGeneratorService.getContractAddress(id);
  }
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ethGeneratorService.remove(id);
  }
}
