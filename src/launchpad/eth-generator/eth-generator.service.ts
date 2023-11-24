import { CreateEthGeneratorDto } from "./dto/create-eth-generator.dto";
import { UpdateEthGeneratorDto } from "./dto/update-eth-generator.dto";
import { DbConnectionService } from "../../db-connection/db-connection.service";

import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import path from "path";
import fs from "fs";
import { userDto } from "./dto/user-eth.dto";
const fs2 = require("fs").promises;
let sortedAttributes = [];
async function attributeSorting(attributes) {
  console.log("\n\n\t SORTING START __________\n\n", attributes);
  let array = attributes;
  let firstSum = 0,
    secondSum = 0,
    firstAtt = 0,
    secondAtt = 0;
  for (let i = 0; i < array.length; i++) {
    for (let j = 1 + i; j < array.length; j++) {
      firstSum = 0;
      for (let first = 0; first < array[i].attributes.length; first++) {
        secondSum = 0;
        for (let second = 0; second < array[j].attributes.length; second++) {
          if (
            array[i].attributes[first].trait_type ===
            array[j].attributes[second].trait_type
          ) {
            if (
              parseFloat(array[i].attributes[first].Rarity) >
              parseFloat(array[j].attributes[second].Rarity)
            ) {
              firstAtt++;
            } else if (
              parseFloat(array[i].attributes[first].Rarity) <
              parseFloat(array[j].attributes[second].Rarity)
            ) {
              secondAtt++;
            }
          }
          secondSum += parseFloat(array[j].attributes[second].Rarity);
        }
        firstSum += parseFloat(array[i].attributes[first].Rarity);
      }
      if (firstAtt > secondAtt || firstSum > secondSum) {
        let tempSwap = array[i];
        array[i] = array[j];
        array[j] = tempSwap;
      }
    }
  }
  sortedAttributes.push(array);
  console.log("\n\n\t SORTING ENDS __________\n\n", array);
}
async function setTraitTypeWithValue(attributes, id) {
  const array = attributes;
  let dataArray = [],
    trait_type = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].attributes.length; j++) {
      for (let k = i + 1; k < array.length; k++) {
        for (let l = 0; l < array[k].attributes.length; l++) {
          // console.log("\n\n_______________________________\n\n");
          // console.log("\t\t___", array[k].attributes[l].trait_type);
          // console.log("\n\n_______________________________\n\n");
          if (
            array[i].attributes[j].trait_type ===
            array[k].attributes[l].trait_type
          ) {
            if (dataArray.length == 0) {
              dataArray.push({
                [array[i].attributes[j].trait_type]:
                  array[i].attributes[j].value,
              });
            } else {
              let flag = 0;
              for (let inner = 0; inner < dataArray.length; inner++) {
                if (
                  dataArray[inner][array[i].attributes[j].trait_type] ===
                  array[i].attributes[j].value
                ) {
                  flag = 1;
                  break;
                }
              }
              if (!flag) {
                dataArray.push({
                  [array[i].attributes[j].trait_type]:
                    array[i].attributes[j].value,
                });
              }
            }
          }
        }
      }
      if (trait_type.length > 0) {
        let flag = 0;
        for (let innerLoop = 0; innerLoop < trait_type.length; innerLoop++) {
          if (trait_type[innerLoop] == array[i].attributes[j].trait_type) {
            flag = 1;
            break;
          }
        }
        if (!flag) {
          trait_type.push(array[i].attributes[j].trait_type);
        }
      } else {
        trait_type.push(array[i].attributes[j].trait_type);
      }
    }
  }

  let firstArr = [],
    finalArr = [];
  for (let a = 0; a < trait_type.length; a++) {
    firstArr = [];
    for (let j = 0; j < dataArray.length; j++) {
      if (dataArray[j][trait_type[a]]) {
        firstArr.push(dataArray[j][trait_type[a]]);
      }
    }
    finalArr.push({ [trait_type[a]]: firstArr });
  }
  console.log(finalArr);
  const jsonConvert = JSON.stringify(finalArr);
  // await model.traitAndvalues.create({
  //   traitWithValues: jsonConvert,
  //   onlyTrait: JSON.stringify(trait_type),
  //   ProjectId: id,
  // })
  console.log(
    "\n\n __________________ MarketPlace Attributes Ends _______________________ \n\n"
  );
  return { jsonConvert, trait_type };
}
@Injectable()
export class EthGeneratorService {
  constructor(private db: DbConnectionService, private config: ConfigService) { }
  async create(dto: CreateEthGeneratorDto) { }
  // async create(dto: CreateEthGeneratorDto) {
  //   //   // –––––––––––––––––––––––––––––––––––– INITIAL VAIRIABLES ___________________
  //   const req = dto.basic;
  //   let projectExist = null;
  //   const ClientProjectName = req[0].projectName,
  //     ClientProjectDescription = req[0].description,
  //     ClientImgLength = req[0].dimensionHeight,
  //     ClientImgWidth = req[0].dimensionWidth,
  //     ClientUserId = req[0].userId;
  //   let userExistInDB = null,
  //     ArtOwnerUserID = null;
  //   //if project already have same name
  //   try {
  //     projectExist = await this.db.launchPadProject.findFirst({
  //       where: { name: ClientProjectName },
  //     });
  //     if (projectExist) {
  //       throw new Error("change the name of your projects");
  //     }

  //     // check if user wallet exist in DB

  //     let attributes = [];
  //     let totalAttributes = [];
  //     let totalSupply = req[0].quantityOfCollection;
  //     let layerTemp = dto.array;
  //     let filenameIndex = 0;
  //     let attributesLength = layerTemp.length;
  //     const date = new Date();
  //     const name = date.getTime();
  //     fs.mkdirSync(`./public/generatedArt/${name}`);
  //     fs.mkdirSync(`./public/generatedArt/${name}/images`);
  //     fs.mkdirSync(`./public/generatedArt/${name}/metaData`);
  //     //   // –––––––––––––––––––––––––––––––––––– INITIAL VAIRIABLES ___________________
  //     let metaDataTemp = [];
  //     let initializeCanva = null,
  //       canvaContext = null,
  //       tempStoreImgLength,
  //       randomImgNumber,
  //       CanvasLoad;
  //     console.log(__dirname);
  //     for (let i = 0; i < totalSupply; i++) {
  //       attributes = [];
  //       initializeCanva = canvas.createCanvas(
  //         ClientImgWidth * 1,
  //         ClientImgLength * 1
  //       );
  //       const canvaContext = initializeCanva.getContext("2d");
  //       for (let j = 0; j < attributesLength; j++) {
  //         tempStoreImgLength = layerTemp[j].image;
  //         randomImgNumber = Math.floor(
  //           Math.random() * tempStoreImgLength.length
  //         );
  //         if (layerTemp[j].image[randomImgNumber].occurance === 0) {
  //           let innerRandom = 0;
  //           let flag = 0;
  //           let CanvasLoad = null;
  //           let innerLoopCounter = 0;
  //           while (1) {
  //             innerRandom = Math.floor(
  //               Math.random() * tempStoreImgLength.length
  //             );
  //             if (innerLoopCounter === layerTemp[j].image.length) {
  //               let flagChecker = 0;
  //               for (
  //                 let lastpicker = 0;
  //                 lastpicker < layerTemp[j].image.length;
  //                 lastpicker++
  //               ) {
  //                 if (layerTemp[j].image[lastpicker].occurance != 0) {
  //                   layerTemp[j].image[lastpicker].occurance =
  //                     layerTemp[j].image[lastpicker].occurance - 1;
  //                   attributes.push({
  //                     trait_type: layerTemp[j].name,
  //                     Occurance: layerTemp[j].image[lastpicker].occurance,
  //                     Rarity: layerTemp[j].image[lastpicker].rarity,
  //                     value: layerTemp[j].image[lastpicker].name,
  //                     // base64: layerTemp[j].image[lastpicker].file.base64,
  //                   });
  //                   CanvasLoad = await canvas.loadImage(
  //                     layerTemp[j].image[lastpicker].base64
  //                   );
  //                   canvaContext.drawImage(
  //                     CanvasLoad,
  //                     0,
  //                     0,
  //                     ClientImgWidth,
  //                     ClientImgLength
  //                   );
  //                   flagChecker = 1;
  //                 }
  //                 if (flagChecker == 1) {
  //                   break;
  //                 }
  //               }
  //               // console.log("length Match with the supply");
  //               break;
  //             } else if (layerTemp[j].image[innerRandom].occurance != 0) {
  //               // console.log("check if the inner loop calls");
  //               flag = 1;
  //             } else {
  //               innerLoopCounter++;
  //             }
  //             if (flag === 1) {
  //               layerTemp[j].image[innerRandom].occurance =
  //                 layerTemp[j].image[innerRandom].occurance - 1;
  //               CanvasLoad = await canvas.loadImage(
  //                 layerTemp[j].image[innerRandom].base64
  //               );
  //               canvaContext.drawImage(
  //                 CanvasLoad,
  //                 0,
  //                 0,
  //                 ClientImgWidth,
  //                 ClientImgLength
  //               );
  //               attributes.push({
  //                 trait_type: layerTemp[j].name,
  //                 Occurance: layerTemp[j].image[innerRandom].occurance,
  //                 Rarity: layerTemp[j].image[innerRandom].rarity,
  //                 value: layerTemp[j].image[innerRandom].name,
  //                 // base64: layerTemp[j].image[innerRandom].file.base64,
  //               });
  //               // console.log("Break calls");
  //               break;
  //             }
  //           }
  //         } else {
  //           // console.log(
  //           //   "onlyElse heerrreee ......",
  //           //   layerTemp[j].image[random].occurance,
  //           //   "\n"
  //           // );
  //           layerTemp[j].image[randomImgNumber].occurance =
  //             layerTemp[j].image[randomImgNumber].occurance - 1;
  //           CanvasLoad = await canvas.loadImage(
  //             layerTemp[j].image[randomImgNumber].base64
  //           );
  //           canvaContext.drawImage(
  //             CanvasLoad,
  //             0,
  //             0,
  //             ClientImgWidth,
  //             ClientImgLength
  //           );
  //           attributes.push({
  //             trait_type: layerTemp[j].name,
  //             Occurance: layerTemp[j].image[randomImgNumber].occurance,
  //             Rarity: layerTemp[j].image[randomImgNumber].rarity,
  //             value: layerTemp[j].image[randomImgNumber].name,
  //             // base64: layerTemp[j].image[randomImgNumber].file.base64,
  //           });
  //         }
  //       }
  //       console.log("\n\n\t\tNFT Number is : : ", i, "\t");
  //       totalAttributes.push({ attributes, imgNumber: i });
  //       const buffer = initializeCanva.toBuffer("image/png");
  //       metaDataTemp.push({
  //         name: ClientProjectName,
  //         description: ClientProjectDescription,
  //         image: `http://localhost:3001/${name}/images/${filenameIndex}.png`,
  //         // imgURL: `http://localhost:5300/artwork/${name}/images/${filenameIndex}.png`,
  //         imgNumber: i,
  //         attributes,
  //       });
  //       // Add description and Project name
  //       fs.writeFileSync(
  //         path.join(
  //           __dirname,
  //           `../../../.././public/generatedArt/${name}/images/${filenameIndex}.png`
  //         ),
  //         buffer
  //       );
  //       filenameIndex++;
  //     }

  //     //  nft generation completed

  //     // fs.writeFileSync(
  //     //   path.join(
  //     //     __dirname,
  //     //     `../../.././public/generatedArt/${name}/metaData/metaData.json`,
  //     //   ),
  //     //   JSON.stringify(metaDataTemp),
  //     // );
  //     console.log("\n\n ____________ DB OPERATION __________");
  //     // __________________________________ DB OPERATIONS ________________________________________
  //     const createdCollection = await this.db.launchPadProject.create({
  //       data: {
  //         name: ClientProjectName,
  //         description: ClientProjectDescription,
  //         nftquantity: totalSupply,
  //         dimensions: JSON.stringify(ClientImgWidth + "x" + ClientImgLength),
  //         type: "Ethreum",
  //         generatedPath: JSON.stringify(name),
  //         walletAddress: "",
  //         twitterLink: "",
  //         discordLink: "",
  //         profileImage: "",
  //         bannerImage: "",
  //         blockchainTypeId: "",
  //         userId: ClientUserId,
  //         // ClientUserId
  //       },
  //     });

  //     // _____+++++++++++++++++++_____________ attribute db operation _____+++++++++++++=
  //     for (let i = 0; i < metaDataTemp.length; i++) {
  //       const id = await this.db.marketplaceNft.create({
  //         data: {
  //           img: `http://localhost:3001/${name}/images/${i}.png`,
  //           imgTokenId: i,
  //           name: `#${i}`,
  //           launchpadProjectId: createdCollection.id,
  //         },
  //       });
  //       // console.log(
  //       //   'user id is here :::::',
  //       //   // id,
  //       //   metaDataTemp[i].attributes.length,
  //       // );
  //       for (let j = 0; j < metaDataTemp[i].attributes.length; j++) {
  //         console.log("", j);
  //         // console.log('metaData', metaDataTemp[i]);

  //         await this.db.marketplaceAttributes.create({
  //           data: {
  //             trait_type: metaDataTemp[i].attributes[j].trait_type,
  //             value: metaDataTemp[i].attributes[j].value,
  //             marketplaceNftId: id.id,
  //           },
  //         });
  //       }
  //       fs.writeFileSync(
  //         `./public/generatedArt/${name}/metaData/${i}.json`,
  //         JSON.stringify(metaDataTemp[i])
  //       );
  //     }
  //     // ______++++++++++++++++_________________ total attribute in server ____+_+_+_+
  //     // fs.writeFileSync(
  //     //   `./public/generatedArt/${name}/${'metaData'}.json`,
  //     //   JSON.stringify(totalAttributes),
  //     // );
  //     // ___+_+___---====--=--  sort
  //     await attributeSorting(totalAttributes);
  //     console.log("sorted First", sortedAttributes[0][1].imgNumber);
  //     // +_+_+_+_++_+++_+++__++++ update in db
  //     for (let i = 0; i < sortedAttributes[0].length; i++) {
  //       await this.db.marketplaceNft.updateMany({
  //         data: { rank: i + 1 },
  //         where: { imgTokenId: sortedAttributes[0][i].imgNumber },
  //       });
  //     }
  //     // ------------------------- get trait and values
  //     const dataOftrait = await setTraitTypeWithValue(
  //       totalAttributes,
  //       createdCollection.id
  //     );
  //     await this.db.marketplacTraitsOrValues.create({
  //       data: {
  //         traitWithValues: dataOftrait.jsonConvert,
  //         onlyTrait: JSON.stringify(dataOftrait.trait_type),
  //         launchpadProjectId: createdCollection.id,
  //       },
  //     });

  //     console.log(
  //       "\n",
  //       "____________________ Successfully Completed ___________________"
  //     );
  //     return true;
  //   } catch (err) {
  //     throw new ForbiddenException(err);
  //   }
  //   return "This action adds a new ethGenerator";
  // }

  async findAll() {
    try {
      const data = await this.db.launchPadProject.findMany({
        where: { isActive: true, type: "Ethreum" },
        select: {
          id: true,
          generatedPath: true,
          ipfsUrlImage: true,
          ipfsUrlmetadata: true,
          name: true,
          description: true,
          dimensions: true,
          type: true,
          nftquantity: true,
          marketplaceNft: {
            select: {
              id: true,
              name: true,
              img: true,
              imgTokenId: true,
              rank: true,
              launchpadProjectId: true,
              marketplaceAttributes: {
                select: {
                  id: true,
                  trait_type: true,
                  value: true,
                  marketplaceNftId: true,
                },
              },
            },
          },
        },
      });
      if (data.length < 0) {
        throw new NotFoundException("no data is found ");
      }
      return data;
    } catch (err) {
      throw new HttpException(err, 404);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.db.launchPadProject.findMany({
        select: {
          id: true,
          generatedPath: true,
          ipfsUrlImage: true,
          ipfsUrlmetadata: true,
          name: true,
          description: true,
          dimensions: true,
          type: true,
          nftquantity: true,
          marketplaceNft: {
            select: {
              id: true,
              name: true,
              img: true,
              imgTokenId: true,
              rank: true,
              launchpadProjectId: true,
              marketplaceAttributes: {
                select: {
                  id: true,
                  trait_type: true,
                  value: true,
                  marketplaceNftId: true,
                },
              },
            },
          },
        },
        where: { name: id, isActive: true, type: "Ethreum" },
      });
      if (data.length <= 0) {
        throw new NotFoundException(
          `no art is generated using this name ${id}`
        );
      }
      return data;
    } catch (err) {
      throw new HttpException(err, 404);
    }
  }
  async findName() {
    try {
      const data = this.db.launchPadProject.findMany({
        where: { type: "Ethreum" },

        select: { name: true },
      });
      return data;
    } catch (err) {
      throw new HttpException(err, 404);
    }
  }
  async storeContractAddress(dto: userDto) {
    try {
      // saletype pre sale / public sale
      // contractAddress update
      // based on userID
      const checkIfExist = await this.db.launchPadProject.findMany({
        where: { userId: dto.userId },
      });
      // contract address update should be preSale and public sale
      const data = await this.db.launchPadProject.updateMany({
        where: { userId: dto.userId },
        data: { preSaleContractAddress: dto.contractAddress },
      });
      console.log(checkIfExist[0].id);
      console.log(data);
      if (!data) {
        return false;
      }
      await this.db.saleType.create({
        data: { type: dto.saleType, launchPadProjectId: checkIfExist[0].id },
      });
      return true;
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
  async getContractAddress(id: string) {
    try {
      const data = await this.db.launchPadProject.findMany({
        select: {
          preSaleContractAddress: true,
          userId: true,
          SaleType: {
            select: {
              type: true,
            },
          },
        },
        where: { userId: id },
      });
      return data;
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }
  update(id: number, updateEthGeneratorDto: UpdateEthGeneratorDto) {
    return `This action updates a #${id} ethGenerator`;
  }

  async remove(id: string) {
    try {
      const check = await this.db.launchPadProject.findMany({
        where: { name: id },
      });
      if (check) {
        if (check[0].isActive) {
          await this.db.launchPadProject.updateMany({
            data: {
              isActive: false,
            },
            where: {
              name: id,
            },
          });
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      throw new HttpException(err, 404);
    }
  }
}
