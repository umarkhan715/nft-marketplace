import { HttpException, Injectable } from "@nestjs/common";
import { CreateSolGeneratorDto } from "./dto/create-sol-generator.dto";
import { UpdateSolGeneratorDto } from "./dto/update-sol-generator.dto";
import { DbConnectionService } from "../../db-connection/db-connection.service";
import { ConfigService } from "@nestjs/config";

import fs from "fs";

import path from "path";
const { NFTStorage, File } = require("nft.storage");
require("dotenv").config();
const fs2 = require("fs").promises;
let sortedAttributes = [];
let PORT = process.env.PORT;

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
async function setTraitTypeWithValue(attributes, id, db) {
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
  return { jsonConvert, trait_type };
  // await model.traitAndvalues.create({
  //   traitWithValues: jsonConvert,
  //   onlyTrait: JSON.stringify(trait_type),
  //   ProjectId: id,
  // });
  console.log(
    "\n\n __________________ MarketPlace Attributes Ends _______________________ \n\n"
  );
}
@Injectable()
export class SolGeneratorService {
  constructor(private db: DbConnectionService, private config: ConfigService) { }
  async create(dto: CreateSolGeneratorDto) {
    // try {
    //   // infoLogger.info('Sol Generation starts');
    //   let projectExist = null;
    //   const req = dto.basic;
    //   const ClientProjectName = req[0].projectName,
    //     ClientArtsymbol = req[0].symbol,
    //     ClientSellerPoint = req[0].sfbp,
    //     ClientProjectDescription = req[0].description,
    //     ClientImgLength = req[0].dimensionHeight,
    //     ClientImgWidth = req[0].dimensionWidth,
    //     ClientwalletAddress = req[0].walletAddress;
    //   let userExistInDB = null,
    //     creators = req[0].creator,
    //     ArtOwnerUserID = null;
    //   let projectID = null;
    //   //if project already have same name

    //   projectExist = await this.db.launchPadProject.findFirst({
    //     where: { name: ClientProjectName },
    //   });
    //   if (projectExist) {
    //     throw new Error("change the name of your projects");
    //   } else if (!PORT) {
    //     throw new Error("Check you Env, Port ");
    //   }

    //   let attributes = [];
    //   let totalAttributes = [];
    //   let totalSupply = req[0].quantityOfCollection;
    //   let layerTemp = dto.array;
    //   let filenameIndex = 0;
    //   let attributesLength = layerTemp.length;
    //   const date = new Date();
    //   const name = date.getTime();
    //   let metaDataTemp = [];

    //   fs.mkdirSync(`./public/generatedArt/${name}`);
    //   fs.mkdirSync(`./public/generatedArt/${name}/images`);
    //   fs.mkdirSync(`./public/generatedArt/${name}/metaData`);
    //   //_________________get Random Attribute and image generation_________________
    //   if (totalSupply < 10) {
    //     throw new Error("Min supply must be 10");
    //   }
    //   for (let i = 0; i < totalSupply; i++) {
    //     let tempStoreImgLength;
    //     let randomImgNumber;
    //     attributes = [];
    //     const initalizeCanva = canvas.createCanvas(
    //       ClientImgWidth * 1,
    //       ClientImgLength * 1
    //     );
    //     const canvaContext = initalizeCanva.getContext("2d");
    //     for (let j = 0; j < attributesLength; j++) {
    //       tempStoreImgLength = layerTemp[j].image;
    //       randomImgNumber = Math.floor(
    //         Math.random() * tempStoreImgLength.length
    //       );
    //       let CanvasLoad = null;

    //       if (layerTemp[j].image[randomImgNumber].occurance === 0) {
    //         let innerRandom = 0;
    //         let flag = 0;
    //         let innerLoopCounter = 0;
    //         while (1) {
    //           innerRandom = Math.floor(
    //             Math.random() * tempStoreImgLength.length
    //           );
    //           if (innerLoopCounter === layerTemp[j].image.length) {
    //             let flagChecker = 0;
    //             for (
    //               let lastpicker = 0;
    //               lastpicker < layerTemp[j].image.length;
    //               lastpicker++
    //             ) {
    //               if (layerTemp[j].image[lastpicker].occurance != 0) {
    //                 layerTemp[j].image[lastpicker].occurance =
    //                   layerTemp[j].image[lastpicker].occurance - 1;
    //                 attributes.push({
    //                   trait_type: layerTemp[j].name,
    //                   Occurance: layerTemp[j].image[lastpicker].occurance,
    //                   Rarity: layerTemp[j].image[lastpicker].rarity,
    //                   value: layerTemp[j].image[lastpicker].name,
    //                   // base64: layerTemp[j].image[lastpicker].file.base64,
    //                 });
    //                 CanvasLoad = await canvas.loadImage(
    //                   layerTemp[j].image[lastpicker].base64
    //                 );
    //                 canvaContext.drawImage(CanvasLoad, 0, 0, 1000, 1000);
    //                 flagChecker = 1;
    //               }
    //               if (flagChecker == 1) {
    //                 break;
    //               }
    //             }
    //             break;
    //           } else if (layerTemp[j].image[innerRandom].occurance != 0) {
    //             flag = 1;
    //           } else {
    //             innerLoopCounter++;
    //           }
    //           if (flag === 1) {
    //             layerTemp[j].image[innerRandom].occurance =
    //               layerTemp[j].image[innerRandom].occurance - 1;
    //             CanvasLoad = await canvas.loadImage(
    //               layerTemp[j].image[innerRandom].base64
    //             );
    //             canvaContext.drawImage(
    //               CanvasLoad,
    //               0,
    //               0,
    //               ClientImgWidth,
    //               ClientImgLength
    //             );
    //             attributes.push({
    //               trait_type: layerTemp[j].name,
    //               Occurance: layerTemp[j].image[innerRandom].occurance,
    //               Rarity: layerTemp[j].image[innerRandom].rarity,
    //               value: layerTemp[j].image[innerRandom].name,
    //               // base64: layerTemp[j].image[innerRandom].file.base64,
    //             });
    //             break;
    //           }
    //         }
    //       } else {
    //         layerTemp[j].image[randomImgNumber].occurance =
    //           layerTemp[j].image[randomImgNumber].occurance - 1;
    //         CanvasLoad = await canvas.loadImage(
    //           layerTemp[j].image[randomImgNumber].base64
    //         );
    //         canvaContext.drawImage(
    //           CanvasLoad,
    //           0,
    //           0,
    //           ClientImgWidth,
    //           ClientImgLength
    //         );
    //         attributes.push({
    //           trait_type: layerTemp[j].name,
    //           Occurance: layerTemp[j].image[randomImgNumber].occurance,
    //           Rarity: layerTemp[j].image[randomImgNumber].rarity,
    //           value: layerTemp[j].image[randomImgNumber].name,
    //           // base64: layerTemp[j].image[randomImgNumber].file.base64,
    //         });
    //       }
    //     }
    //     console.log("\n\n\t\tNFT Number is : : ", i, "\t");
    //     totalAttributes.push({ attributes, imgNumber: i });
    //     const buffer = initalizeCanva.toBuffer("image/png");
    //     metaDataTemp.push({
    //       name: `${ClientProjectName} #${i}`,
    //       symbol: ClientArtsymbol,
    //       description: ClientProjectDescription,
    //       seller_fee_basis_points: ClientSellerPoint,
    //       image: `http://localhost:${PORT}/artwork/${name}/images/${filenameIndex}.png`,
    //       imgNumber: i,
    //       attributes,
    //       creators: creators,
    //     });
    //     // Add description and Project name
    //     fs.writeFileSync(
    //       path.join(
    //         __dirname,
    //         `../../../.././public/generatedArt/${name}/images/${filenameIndex}.png`
    //       ),
    //       buffer
    //     );
    //     filenameIndex++;
    //   }

    //   // Store Basic data into DB

    //   projectID = await this.db.launchPadProject.create({
    //     data: {
    //       name: ClientProjectName,
    //       description: ClientProjectDescription,
    //       dimensions: JSON.stringify(ClientImgWidth + "x" + ClientImgLength),
    //       type: "solana",
    //       nftquantity: totalSupply,
    //       generatedPath: JSON.stringify(name),
    //       walletAddress: "",
    //       twitterLink: "",
    //       discordLink: "",
    //       profileImage: "",
    //       bannerImage: "",
    //       blockchainTypeId: "",
    //       userId: ArtOwnerUserID,
    //       isActive: true,
    //     },
    //   });
    //   console.log("\n\n\t\tlength Temp ", metaDataTemp.length);
    //   //_____________________MetaData file generation and store in db_______________________________
    //   for (let i = 0; i < metaDataTemp.length; i++) {
    //     const { id } = await this.db.marketplaceNft.create({
    //       data: {
    //         img: `http://localhost:${PORT}/generatedArt/${name}/images/${i}.png`,
    //         imgTokenId: i,
    //         launchpadProjectId: projectID.id,
    //         description: "",
    //         name: `NFT ${i} `,
    //       },
    //     });
    //     console.log(
    //       "user id is here :::::",
    //       id,
    //       metaDataTemp[i].attributes.length
    //     );
    //     for (let j = 0; j < metaDataTemp[i].attributes.length; j++) {
    //       console.log("", j);
    //       await this.db.marketplaceAttributes.create({
    //         data: {
    //           trait_type: metaDataTemp[i].attributes[j].trait_type,
    //           value: metaDataTemp[i].attributes[j].value,
    //           marketplaceNftId: id,
    //         },
    //       });
    //     }
    //     fs.writeFileSync(
    //       `./public/generatedArt/${name}/metaData/${i}.json`,
    //       JSON.stringify(metaDataTemp[i])
    //     );
    //   }
    //   //________________store total attributes______________________________________
    //   fs.writeFileSync(
    //     `./public/generatedArt/${name}/${"metaData"}.json`,
    //     JSON.stringify(totalAttributes)
    //   );
    //   //__________________sorting Attribute __________________

    //   attributeSorting(totalAttributes);
    //   for (let i = 0; i < sortedAttributes[0].length; i++) {
    //     await this.db.marketplaceNft.updateMany({
    //       data: {
    //         rank: i + 1,
    //       },
    //       where: { imgTokenId: sortedAttributes[0][i].imgNumber },
    //     });
    //   }
    //   //_________________ Set Trait_type and Value ______________________
    //   const responseOftrait = await setTraitTypeWithValue(
    //     totalAttributes,
    //     projectID.id,
    //     this.db
    //   );
    //   // await this.db.traitAndvalues.create({
    //   //   data: {
    //   //     onlyTrait: JSON.stringify(responseOftrait.trait_type),
    //   //     traitWithValues: responseOftrait.jsonConvert,
    //   //   },
    //   // });
    //   console.log(
    //     "\n\n_______________________ creators _____________________________"
    //   );
    //   // for (let loop = 0; loop < creators.length; loop++) {
    //   //   await model.creators.create({
    //   //     address: creators[loop].creatorAddress,
    //   //     share: creators[loop].creatorShare,
    //   //     ProjectId: projectID.id,
    //   //   });
    //   // }
    //   console.log("\n\n\t\t END METADATA \n\n");
    //   // ends here
    // } catch (err) {
    //   throw new HttpException(err, 404);
    // }
  }

  async findAll() {
    try {
      const data = await this.db.launchPadProject.findMany({
        where: { isActive: true, type: "solana" },
        select: {
          id: true,
          generatedPath: true,
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
        throw new HttpException("no data is found ", 404);
      }
      return data;
    } catch (err) {
      throw new HttpException(err, 404);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} solGenerator`;
  }

  update(id: number, updateSolGeneratorDto: UpdateSolGeneratorDto) {
    return `This action updates a #${id} solGenerator`;
  }

  remove(id: number) {
    return `This action removes a #${id} solGenerator`;
  }
}
