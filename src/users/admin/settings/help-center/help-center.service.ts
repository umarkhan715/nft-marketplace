import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { response, Response } from "express";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import {
  CreateHelpCenterDto,
  UpdateHelpCenterDto,
  FormFieldDto,
  DropDownDto,
} from "./dto/create-help-center.dto";

@Injectable()
export class HelpCenterService {
  constructor(private db: PrismaService) { }
  //
  async AddhelpCenterOption(
    createHelpCenterDto: CreateHelpCenterDto,
    response: Response
  ) {
    try {
      let iscreated = await this.db.heplCenterOption.upsert({
        where: { id: createHelpCenterDto.Id },
        create: {
          name: createHelpCenterDto.Name,
          parentId: createHelpCenterDto.ParentId,
        },
        update: {
          name: createHelpCenterDto.Name,
          parentId: createHelpCenterDto.ParentId,
        },
      });
      if (iscreated) {
        return response.status(200).json(iscreated);
      } else {
        throw new HttpException(
          "something went wroung",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findAllParentOptionList(response: Response) {
    try {
      let iscreated = await this.db.heplCenterOption.findMany({
        where: {
          parentId: null,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          created_at: "asc",
        },
      });
      if (iscreated) {
        return response.status(200).json(iscreated);
      } else {
        throw new HttpException("Record not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async findAllOptionList(response: Response) {
    try {
      let iscreated = await this.db.heplCenterOption.findMany({
        select: {
          id: true,
          name: true,
          parentId: true,
        },
        orderBy: {
          created_at: "asc",
        },
      });
      if (iscreated) {
        return response.status(200).json(iscreated);
      } else {
        throw new HttpException("Record not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  async findSingleOption(optionId: string, response: Response) {
    try {
      let isfound = await this.db.heplCenterOption.findUnique({
        where: {
          id: optionId,
        },
        include: {
          FormField: true,
          Dropdowns: {
            include: {
              // options: true,
            },
          },
        },
      });

      if (isfound) {
        return response.status(200).json(isfound);
      } else {
        throw new HttpException("Record not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  async deleteoption(optionId: string, response: Response) {
    try {
      let isDeleted = await this.db.heplCenterOption.delete({
        where: {
          id: optionId,
        },
      });
      if (isDeleted) {
        return response.status(204).json(isDeleted);
      } else {
        throw new HttpException("No Record To Delete", HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  //  formfield
  async addFormFieldToOption(Dto: FormFieldDto, response: Response) {
    try {
      let iscreated = await this.db.helpCenterField.create({
        data: {
          FiledName: Dto.FiledName,
          heplCenterOptionId: Dto.heplCenterOptionId,
        },
      });
      if (iscreated) {
        return response.status(200).json(iscreated);
      } else {
        throw new HttpException(
          "something went wroung",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  async getallformfield(response: Response) {
    try {
      let isFound = await this.db.helpCenterField.findMany({});
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("Record Not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getallsingleformfield(formfieldId: string, response: Response) {
    try {
      let isFound = await this.db.helpCenterField.findUnique({
        where: {
          id: formfieldId,
        },
      });
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("Record Not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deleteformfield(formfieldId: string, response: Response) {
    try {
      let isDeleted = await this.db.helpCenterField.delete({
        where: {
          id: formfieldId,
        },
      });
      if (isDeleted) {
        return response.status(204).json(isDeleted);
      } else {
        throw new HttpException("Record Not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async updateformfield(dto: FormFieldDto) {
    try {
      let isDeleted = await this.db.helpCenterField.update({
        where: {
          id: dto.Id,
        },
        data: dto,
      });
      if (isDeleted) {
        return isDeleted;
      } else {
        throw new HttpException("Record Not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
  // dropdown
  async addDropDownToOption(Dto: DropDownDto, response: Response) {
    try {
      let data = [];
      Dto.options.forEach((item) => {
        data.push({
          parentId: Dto.ParentId,
          name: item,
        });
      });

      let iscreated = await this.db.helpCenterDropDown.create({
        data: {
          dropdownName: Dto.dropdownName,
          heplCenterOptionId: Dto.heplCenterOptionId,
          // options: {
          // create: data,
          // },
        },
      });
      if (iscreated) {
        return response.status(200).json(iscreated);
      } else {
        throw new HttpException(
          "something went wroung",
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getalldropdownfield(response: Response) {
    try {
      let isFound = await this.db.helpCenterDropDown.findMany({
        include: {
          // options: true,
        },
      });
      if (isFound) {
        return response.status(200).json(isFound);
      } else {
        throw new HttpException("Record Not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getallsingldropdownfield(formfieldId: string, response: Response) {
    try {
      let isFound = await this.db.helpCenterDropDown.findUnique({
        where: {
          id: formfieldId,
        },
        include: {
          // options: true,
        },
      });
      if (isFound) {
        return response.json(200).json(isFound);
      } else {
        throw new HttpException("Record Not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deletedropdownfield(formfieldId: string, response: Response) {
    try {
      let isDeleted = await this.db.helpCenterDropDown.delete({
        where: {
          id: formfieldId,
        },
      });
      if (isDeleted) {
        return response.status(204).json(isDeleted);
      } else {
        throw new HttpException("Record Not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
