import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import abitest from "../../src/abi.json";
import { ConfigService } from "@nestjs/config";
import { DbConnectionService } from "../db-connection/db-connection.service";
import {
  CreateMarketplaceDto,
  MarketplaceCollectionDto,
} from "./dto/create-marketplace.dto";
import { UpdateMarketplaceDto } from "./dto/update-marketplace.dto";
const Web3 = require("web3");
const fs = require("fs");
import { Connection, PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { CreateMarketplaceSolDto } from "./dto/marketplace-sol-Collection.dto";
import { OffersController } from "./offers/offers.controller";
import {
  marketpalceNftdto,
  querymarketplaceDTO,
} from "./dto/query-marketplace.dto";
import { wishListmarketplaceDTO } from "./dto/wishList-marketplace.dto";
import { watchListmarketplaceDTO } from "./dto/watchList-marketplace.dto";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import { response, Response } from "express";
import { rankFunctions } from "src/common/reuseable-component/rank-functions";
import { ContractType } from "@prisma/client";
import conrtactAbi from "./contractAbi.json";
const axios = require("axios").default;

const metadataProgramId = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const METADATA_REPLACE = new RegExp("\u0000", "g");

async function getTokenHashListByCreator(creator: string, collection: string) {
  let solUrl = [],
    mintAddress = [];
  const connection = new Connection(
    // 'https://api.devnet.solana.com',//dev net
    "https://empty-silent-liquid.solana-mainnet.quiknode.pro/8807530ab1f4a388ba3df4c7f1f20334f813b096/",
    "confirmed"
  );
  console.log("inside first");
  let collectionName = await getCollectionName(connection, collection);
  console.log("collection Name", collectionName);

  let metadataProgramAccounts = await connection.getProgramAccounts(
    metadataProgramId,
    {
      filters: [
        { dataSize: 679 },
        {
          memcmp: {
            offset: 326,
            bytes: creator,
          },
        },
      ],
    }
  );
  console.log("length : ", metadataProgramAccounts.length);
  for (let i = 0; i < metadataProgramAccounts.length; i++) {
    // console.log(metadataProgramAccounts[i].pubkey.toBase58());
    let metadata = await Metadata.deserialize(
      metadataProgramAccounts[i].account.data
    );

    // console.log('creator length', metadata.data.data.creators.length);

    for (let j = 0; j < metadata[0].data.creators.length; j++) {
      if (
        metadata[0].data.creators[0].verified == true &&
        metadata[0].collection.key.toBase58() == collection &&
        metadata[0].collection.verified == true
      ) {
        // console.log('data Url : ', metadata.data.data.uri, '\n');
        // console.log('else calls', metadata.data.mint);
        let uri = metadata[0].data.uri.replace(METADATA_REPLACE, "");
        solUrl.push(uri);
        mintAddress.push(metadata[0].mint.toBase58());
        //url and mint address here
        break;
        //push into database or whatever and whereever you want
      } else {
      }
    }
  }
  console.log("end");
  return { solUrl, mintAddress, collectionName };
}
async function getCollectionName(connection: Connection, collection: string) {
  let metadatAc = await getMedataAccount(new PublicKey(collection));
  let collectionMetadata = await Metadata.fromAccountAddress(
    connection,
    metadatAc[0]
  );
  return collectionMetadata.data.name.replace(METADATA_REPLACE, "");
}
async function getMedataAccount(mintKey: PublicKey) {
  return await PublicKey.findProgramAddress(
    [Buffer.from("metadata"), metadataProgramId.toBuffer(), mintKey.toBuffer()],
    metadataProgramId
  );
}
@Injectable()
export class MarketplaceService {
  constructor(private db: DbConnectionService, private config: ConfigService) {}

  async getAllCollection(response: Response) {
    try {
      let allCollection = await this.db.marketplaceCollection.findMany({
        include: { UserCollection: true },
      });
      if (allCollection) {
        return response.status(HttpStatus.OK).json(allCollection);
      } else {
        return response.status(HttpStatus.NOT_FOUND).json([]);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getAllNft(dto: marketpalceNftdto, response: Response) {
    try {
      let pageNo: number | undefined =
        dto.pageNo == undefined ? 0 : dto?.pageNo;
      let limit: number | undefined = dto.limit == undefined ? 0 : dto?.limit;
      let allNfts = await this.db.marketplaceNft.findMany({
        skip: pageNo * limit,
        take: dto?.limit,
        where: {
          id: dto.nftId ?? undefined,
        },
        include: {
          marketplaceAttributes: dto.attributes ?? false,
        },
      });
      if (allNfts) {
        return response.status(HttpStatus.OK).json(allNfts);
      } else {
        return response.status(HttpStatus.NOT_FOUND).json([]);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getSingleCollection(collectionid: string, response: Response) {
    console.log("in single collection", collectionid);
    try {
      let collection = await this.db.marketplaceCollection.findUnique({
        where: { id: collectionid },
        include: {
          marketplaceNft: {
            include: { marketplaceAttributes: true },
            take: 20,
          },
        },
      });
      if (collection) {
        return response.status(HttpStatus.OK).json(collection);
      } else {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Collection not found" });
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async deletemarketplaceCollection(collectionid: string, response: Response) {
    console.log("in delte collection", collectionid);
    try {
      let collection = await this.db.marketplaceCollection.delete({
        where: { id: collectionid },
      });
      if (collection) {
        return response.status(HttpStatus.OK).json(collection);
      } else {
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "Collection not found" });
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async createEthCollection(dto: CreateMarketplaceDto) {
    console.log("Contract Address", dto.contractAddress);
    try {
      let responseofOpenSea = null;
      const rejectedApiData = {
        name: "no data found",
        description: "no data found",
        image: "no data found",
        attributes: [],
        nftScore: 0,
      };
      let missingData = [];
      let ipfsUrlOne = "https://ipfs.io/ipfs";
      let ipfsUrlTwo = "ipfs://";
      let jsonFormat = 0,
        notjsonFormat = 0,
        jsonFormatElse = 0,
        singleOccuranceRarity = 0.0;
      responseofOpenSea = await axios.get(
        `https://api.opensea.io/api/v1/asset_contract/${dto.contractAddress}`,
        {
          headers: {
            "X-API-KEY": process.env.X_API_KEY,
          },
        }
      );
      console.log(dto);
      let clientContractAddress = null,
        responseOfContract = null,
        getData = null,
        totalSupply = null;
      clientContractAddress = dto.contractAddress;
      let start;
      let loopStartTopTen;
      let web3 = new Web3(process.env.INFRA_URL);
      console.log("getting contract...ABI");

      //get the contract abi
      let abi = await this.generateabi(dto.contractAddress);

      const ct = new web3.eth.Contract(abi, clientContractAddress);
      totalSupply = await ct.methods.totalSupply().call();

      singleOccuranceRarity = 100 / totalSupply;
      if (!totalSupply) {
        throw new Error("total supply is not mentioned in your contract");
      }
      try {
        responseOfContract = await ct.methods.tokenURI(0).call();
        console.log(responseOfContract);
        if (JSON.stringify(responseOfContract).search("/0.json") > 0) {
          jsonFormat = 1;
          // console.log("else JSON format ");
        } else if (JSON.stringify(responseOfContract).search("/0") > 0) {
          notjsonFormat = 1;
          // console.log("else not json format");
        }
        let ipfsCheckTwo = JSON.stringify(responseOfContract).substring(1, 8);
        let ipfsCheckOne = JSON.stringify(responseOfContract).substring(1, 21);
        let pinataCheckThird = JSON.stringify(responseOfContract).search(
          ".mypinata.cloud/ipfs"
        );
        let pinataCheckFourth =
          JSON.stringify(responseOfContract).search(".pinata.cloud/ipfs");

        if (ipfsCheckTwo === ipfsUrlTwo) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            8,
            54
          );
          console.log("\n inside Zero Url Second Check\n", responseOfContract);
        } else if (ipfsCheckOne === ipfsUrlOne) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            22,
            69
          );
          console.log("\n inside Zero Url First Check\n", responseOfContract);
        } else if (pinataCheckThird > 0) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            pinataCheckThird + 21,
            pinataCheckThird + 21 + 46
          );
          console.log("\n inside Zero Url Third Check\n", responseOfContract);
        } else if (pinataCheckFourth > 0) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            pinataCheckFourth + 19,
            pinataCheckFourth + 19 + 46
          );
          console.log("\n inside Zero Url Fourth Check\n", responseOfContract);
        } else {
          jsonFormatElse = 1;

          console.log("\n inside Zero Url Else Check\n", responseOfContract);
        }
        start = 0;
        totalSupply = totalSupply - 1;
      } catch (err) {
        responseOfContract = await ct.methods.tokenURI(1).call();
        // const checker = await axios.get(responseOfContract);
        console.log(
          "\n\n _______________ url One _______________________ ",
          responseOfContract,
          "\n"
        );
        //  check if format is JSON or not
        if (JSON.stringify(responseOfContract).search("/1.json") > 0) {
          jsonFormat = 1;
        } else if (JSON.stringify(responseOfContract).search("/1") > 0) {
          notjsonFormat = 1;
        }
        // end

        // console.log("original response of contract", responseOfContract);
        // total supply remain same
        // check if url is ipfs or pinata
        let ipfsCheckTwo = JSON.stringify(responseOfContract).substring(1, 8);
        let ipfsCheckOne = JSON.stringify(responseOfContract).substring(1, 21);
        let pinataCheckThird = JSON.stringify(responseOfContract).search(
          ".mypinata.cloud/ipfs"
        );
        let pinataCheckFourth =
          JSON.stringify(responseOfContract).search(".pinata.cloud/ipfs");
        if (ipfsCheckTwo === ipfsUrlTwo) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            8,
            54
          );
          console.log("\n inside One second Check \n", responseOfContract);
        } else if (ipfsCheckOne === ipfsUrlOne) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            22,
            69
          );
          console.log("\n inside One first Check \n", responseOfContract);
        } else if (pinataCheckThird > 0) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            pinataCheckThird + 21,
            pinataCheckThird + 21 + 46
          );
          console.log("\n inside Zero Url Third Check\n", responseOfContract);
        } else if (pinataCheckFourth > 0) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            pinataCheckFourth + 19,
            pinataCheckFourth + 19 + 46
          );
          console.log("\n inside Zero Url Fourth Check\n", responseOfContract);
        } else {
          jsonFormatElse = 1;
        }
        // end here
        start = 1;
      }
      let imgIndexStart = start;
      loopStartTopTen = start;
      if (jsonFormatElse) {
        responseOfContract = responseOfContract.split(`/${start}`)[0];
      }
      console.log("res", responseOfContract);
      console.log("total supply", totalSupply);
      console.log("start point", start);
      console.log("IsJson", jsonFormat);
      console.log("notJson", notjsonFormat);
      console.log("else check", jsonFormatElse);
      // Start
      let apiArray = [],
        loopIterations = 0,
        flag = 0;
      let difference = 1000;
      if (totalSupply <= 1000) {
        loopIterations = totalSupply;
      } else {
        loopIterations = difference;
      }
      const jsons = null;
      var responseOfApis = [];
      var testArray = [];
      // ends
      if (jsonFormat) {
        while (1) {
          for (start; start <= loopIterations; start++) {
            // const cleanIpfs = `${responseOfContract}${start}`;
            // const cleanSub = cleanIpfs.substring(7);
            if (!jsonFormatElse) {
              console.log(
                "JSON Format",
                `${process.env.IPFS_GATEWAY}/${responseOfContract}/${start}.json`,
                "\n"
              );
              apiArray.push(
                axios.get(
                  `${process.env.IPFS_GATEWAY}/${responseOfContract}/${start}.json`
                )
              );
            } else if (jsonFormatElse) {
              console.log(
                "JSON format else",
                `${responseOfContract}/${start}.json`,
                "\n"
              );
              apiArray.push(axios.get(`${responseOfContract}/${start}.json`));
            }
          }

          // const response = await Promise.all(apiArray);
          const response = await Promise.allSettled(apiArray);
          const res2 = await response;
          let dataTemp = [];
          for (let i = 0; i < response.length; i++) {
            if (response[i].status === "fulfilled") {
              dataTemp.push(response[i]);
            } else if (response[i].status === "rejected") {
              dataTemp.push({ status: response[i].status });
              console.log(response[i]);
            }
          }
          // fs.writeFileSync(`./metadata/status.json`, JSON.stringify(dataTemp));
          for (let i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i].status === "fulfilled") {
              responseOfApis.push(dataTemp[i].value.data);
            } else if (dataTemp[i].status === "rejected") {
              dataTemp.push(rejectedApiData);
            }
          }
          let responseArray = [];
          // responseArray = await Promise.all(
          //   response.map(async (r) => await r.data),
          // );
          // responseOfApis.push(...responseArray);
          apiArray = [];
          // testArray.push(responseOfApis);
          start = loopIterations + 1;
          if (loopIterations == totalSupply) {
            break;
          }
          difference = difference + 1000;

          if (difference <= totalSupply) {
            loopIterations = difference;
            // if (difference == totalSupply) {
            // flag = 1;
            // }
          } else {
            console.log("else calls ", loopIterations);
            loopIterations = totalSupply;
            // flag = 1;
          }
          console.log("difference", difference, "total supply", totalSupply);
        }
      } else if (notjsonFormat) {
        while (1) {
          for (start; start <= loopIterations; start++) {
            // const cleanIpfs = `${responseOfContract}${start}`;
            // const cleanSub = cleanIpfs.substring(7);
            if (!jsonFormatElse) {
              apiArray.push(
                axios.get(
                  `${process.env.IPFS_GATEWAY}/${responseOfContract}/${start}`
                )
              );
              console.log(
                "first not Json true",
                `${process.env.IPFS_GATEWAY}/${responseOfContract}/${start}`,
                "\n"
              );
            } else if (jsonFormatElse) {
              apiArray.push(axios.get(`${responseOfContract}/${start}`));
              console.log(
                "second not json Format",
                `${responseOfContract}/${start}`,
                "\n"
              );
            }
          }

          // const response = await Promise.all(apiArray);
          let responseArray = [];
          // responseArray = await Promise.all(
          //   response.map(async (r) => await r.data),
          // );
          // responseOfApis.push(...responseArray);
          console.log("aboe response");
          const response = await Promise.allSettled(apiArray);
          console.log("under response");
          let dataTemp = [];
          for (let i = 0; i < response.length; i++) {
            if (response[i].status === "fulfilled") {
              dataTemp.push(response[i]);
            } else if (response[i].status === "rejected") {
              dataTemp.push({ status: response[i].status });
              console.log(response[i]);
            }
          }
          // fs.writeFileSync(`./metadata/status.json`, JSON.stringify(dataTemp));

          for (let i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i].status === "fulfilled") {
              responseOfApis.push(dataTemp[i].value.data);
            } else if (dataTemp[i].status === "rejected") {
              responseOfApis.push(rejectedApiData);
            }
          }
          apiArray = [];
          // testArray.push(responseOfApis);
          start = loopIterations + 1;
          if (loopIterations == totalSupply) {
            break;
          }
          difference = difference + 1000;

          if (difference <= totalSupply) {
            loopIterations = difference;
            // if (difference == totalSupply) {
            // flag = 1;
            // }
          } else {
            console.log("else calls ", loopIterations);
            loopIterations = totalSupply;
            // flag = 1;
          }
          console.log("difference", difference, "total supply", totalSupply);
        }
      }
      console.log("LoopStart Top ten", loopStartTopTen);
      console.log("response of apis length 2", responseOfApis.length);
      // fs.writeFileSync(
      //   `./metadata/ethReponseApiDel.json`,
      //   JSON.stringify(responseOfApis),
      // );
      // return responseOfApis;
      let checkerInsideLoop = 0;
      let typeOfImg = null;
      let index = loopStartTopTen;
      for (let i = 0; i < responseOfApis.length; i++) {
        responseOfApis[
          i
        ].openseaLink = `${process.env.OPENSEA_GATEWAY}${clientContractAddress}/${index}`;
        index++;
        if (checkerInsideLoop == 0) {
          typeOfImg = responseOfApis[i].image;
          // console.log('images ', typeOfImg.length);
          // checkerInsideLoop = 1;
          let ipfsCheckTwo = JSON.stringify(typeOfImg).substring(1, 8);
          let ipfsCheckOne = JSON.stringify(typeOfImg).substring(1, 21);
          let pinataCheckThird = JSON.stringify(typeOfImg).search(
            ".mypinata.cloud/ipfs"
          );
          let pinataCheckFourth =
            JSON.stringify(typeOfImg).search(".pinata.cloud/ipfs");
          // check if Format is json or not

          if (ipfsCheckTwo === ipfsUrlTwo) {
            typeOfImg = JSON.stringify(typeOfImg).substring(
              8
              // , 54
            );
            // console.log('\n inside Zero Url Second Check\n', typeOfImg);
          } else if (ipfsCheckOne === ipfsUrlOne) {
            typeOfImg = JSON.stringify(typeOfImg).substring(
              22
              // ,
              //  69
            );
            // console.log('\n inside Zero Url First Check\n', typeOfImg);
          } else if (pinataCheckThird > 0) {
            typeOfImg = JSON.stringify(typeOfImg).substring(
              pinataCheckThird + 21
              // pinataCheckThird + 21 + 46,
            );
            // console.log('\n inside Zero Url Third Check\n', typeOfImg);
          } else if (pinataCheckFourth > 0) {
            typeOfImg = JSON.stringify(typeOfImg).substring(
              pinataCheckFourth + 19
              // pinataCheckFourth + 19 + 46,
            );
            // console.log('\n inside Zero Url Fourth Check\n', typeOfImg);
          }
        }
        typeOfImg = typeOfImg.replace(/(^"|"$)/g, "");
        // console.log('g_______________________________________', typeOfImg);
        if (!jsonFormatElse) {
          responseOfApis[i].image = `${process.env.IPFS_GATEWAY}/${typeOfImg}`;
          // imgIndexStart++;
        }
      }

      // fs.writeFileSync(
      //   `./metadata/${dto.contractAddress}-imgSet.json`,
      //   JSON.stringify(responseOfApis),
      // );
      fs.writeFileSync(`./eth.json`, JSON.stringify(responseOfApis));
      // //________________________________________________ set rarity in an array
      console.log("rarity");

      let occurArray = [];
      let array = responseOfApis;
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].attributes.length; j++) {
          let count = 0;
          //   flag = 0;
          // if (occurArray.length > 0) {
          //   flag = 0;
          // } else {
          //   for (let index = 0; index < occurArray.length; index++) {
          //     if (
          //       array[i].attributes[j].value === occurArray[index].value &&
          //       array[i].attributes[j].trait_type ===
          //         occurArray[index].trait_type
          //     ) {
          //       flag = 1;
          //       break;
          //     }
          //   }
          // }
          // if (!flag) {
          //   for (let k = 1 + i; k < array.length; k++) {
          //     for (let h = 0; h < array[k].attributes.length; h++) {
          //       if (
          //         array[i].attributes[j].value ==
          //           array[k].attributes[h].value &&
          //         array[i].attributes[j].trait_type ==
          //           array[k].attributes[h].trait_type &&
          //         array[k].attributes[j] != null
          //       ) {
          //         count++;
          //         // console.log("\n\n", array[k].attributes[j], i, j, k);
          //       }
          //     }
          //   }
          let flag = 0;
          for (let h = 0; h < occurArray.length; h++) {
            if (
              occurArray[h].trait_type === array[i].attributes[j].trait_type &&
              occurArray[h].value === array[i].attributes[j].value
            ) {
              flag = 1;
              break;
            }
          }
          if (flag == 0) {
            for (let l = 0; l < array.length; l++) {
              for (let k = 0; k < array[l].attributes.length; k++) {
                if (
                  array[i].attributes[j].value ===
                    array[l].attributes[k].value &&
                  array[i].attributes[j].trait_type ===
                    array[l].attributes[k].trait_type
                ) {
                  count = count + 1;
                }
              }
            }
            let tempDel = singleOccuranceRarity * count;
            occurArray.push({
              trait_type: array[i].attributes[j].trait_type,
              value: array[i].attributes[j].value,
              occurance: count,
              score: 100 - tempDel,
            });
          }
          // set update formula of ranking

          // }
        }
      }

      for (let i = 0; i < array.length; i++) {
        try {
          let check = array[i].name.length;
          if (check === 0) {
            array[i].name = `${i}`;
          }
        } catch (err) {
          array[i].name = `${i}`;
        }

        let sum = 0;
        for (let j = 0; j < array[i].attributes.length; j++) {
          for (let k = 0; k < occurArray.length; k++) {
            if (
              array[i].attributes[j].value === occurArray[k].value &&
              array[i].attributes[j].trait_type === occurArray[k].trait_type
            ) {
              array[i].attributes[j].occurance = occurArray[k].occurance;
              array[i].attributes[j].score = occurArray[k].score;
              break;
            }
          }
          // sum += array[i].attributes[j].score;
        }
        // array[i].nftScore = 100 - sum;
      }
      for (let i = 0; i < array.length; i++) {
        let sum = 0.0;
        // console.log(i);
        for (let j = 0; j < array[i].attributes.length; j++) {
          // console.log(j);
          sum += array[i].attributes[j].score;
        }
        array[i].nftScore = sum;
      }
      // fs.writeFileSync(`./metadata/Ethrarity.json`, JSON.stringify(array));
      // return false;
      console.log(dto.userId);
      // ____________ db operations _________________
      const insertedCollection = await this.db.marketplaceCollection.create({
        data: {
          name: responseofOpenSea.data.collection.name,
          projectType: "ethereum",
          quantity: parseInt(totalSupply),
          contractAddress: dto.contractAddress,
          description: responseofOpenSea.data.description,
          UserId: dto.userId,
          bannerImage: responseofOpenSea.data.collection.featured_image_url,
        },
      });
      let insertedNft = null;
      for (let i = 0; i < array.length; i++) {
        insertedNft = await this.db.marketplaceNft.create({
          data: {
            name: array[i].name,
            img: array[i].image,
            score: array[i].nftScore,
            description: array[i].description,
            imgTokenId: i + 1,
            marketplaceCollectionId: insertedCollection.id,
            launchpadProjectId: null,
          },
        });
        for (let j = 0; j < array[i].attributes.length; j++) {
          await this.db.marketplaceAttributes.create({
            data: {
              trait_type: array[i].attributes[j].trait_type,
              value: array[i].attributes[j].value,
              marketplaceNftId: insertedNft.id,
            },
          });
        }
      }
      console.log("\n\n ranking : \n\n");
      // console.log("ok", array[0].attributes[1]);
      let firstSum = 0,
        secondSum = 0,
        firstAtt = 0,
        secondAtt = 0;
      // //________________________________________________ sorting json array
      //
      for (let i = 0; i < array.length; i++) {
        for (let j = 1 + i; j < array.length; j++) {
          firstSum = 0;
          if (array[i].nftScore < array[j].nftScore) {
            let tempStore = array[i];
            array[i] = array[j];
            array[j] = tempStore;
          }
        }
      }
      // rank
      for (let i = 0; i < array.length; i++) {
        array[i].rank = i + 1;
        await this.db.marketplaceNft.updateMany({
          data: { rank: i + 1 },
          where: { img: array[i].image },
        });
      }

      // __________________________    DB STORE _________________________________

      // fs.writeFileSync(
      //   `.metadataRanking/${dto.contractAddress}-TopTen.json`,
      //   JSON.stringify(topTenNft),
      // );
      console.log("\n\n end here \n\n");
      return array;
    } catch (err) {
      console.log(err);
      return err;
    }
    // return 'This action adds a new marketplace';
  }

  async createSolCollection(dto: CreateMarketplaceSolDto) {
    console.log("ok ho gya", dto);
    const data = await getTokenHashListByCreator(
      dto.creartorAddress,
      dto.collectionAddress
    );
    console.log("__________________ inside TS ______________");
    console.log("\n");
    console.log("____________________ \n", data);
    const urls = data.solUrl;
    const mintAddArr = data.mintAddress;
    const collectionName = data.collectionName;
    const dataIfNull = {
      name: "no data found",
      description: "no data found",
      symbol: "no data found",
      seller_fee_basis_points: 0,
      external_url: "no data found",
      image: "no data found",
      attributes: [],
      nftScore: 0,
    };
    let apiArrayAxiosCall = [],
      urlData = [];
    let loopIterations = 0,
      difference = 1000,
      start = 0;
    fs.writeFileSync("./metadata/solData.json", JSON.stringify(urls));
    fs.writeFileSync(
      "./metadata/mintData.json",
      JSON.stringify(data.mintAddress)
    );
    if (urls.length <= 1000) {
      loopIterations = urls.length;
    } else {
      loopIterations = difference;
    }
    console.log("loop iteration", loopIterations);
    let dataArr = [];
    let urlToVerify = [];
    while (1) {
      apiArrayAxiosCall = [];
      for (start; start < loopIterations; start++) {
        console.log("first check", urls[start], start);
        apiArrayAxiosCall.push(axios.get(`${urls[start]}`));
        // apiArrayAxiosCall.push(
        //   axios.create({ baseURL: urls[start], Proxy: false }),
        // );
      }
      let response = await Promise.allSettled(apiArrayAxiosCall);
      const res2 = await response;
      // return CircularJSON.stringify(response);
      urlData = [];
      // for (let index = 0; index < response.length; index++) {
      //   if (response[index].status == 'fulfilled') {
      //     urlData.push(response[index]);
      //   } else if (response[index].status == 'rejected') {
      //     console.log(response[index].status);
      //     urlData.push(response[index]);
      //   }
      // }
      urlData = response;
      for (let i = 0; i < urlData.length; i++) {
        if (urlData[i].status === "fulfilled") {
          urlToVerify.push(urlData[i].value.config.url);
          dataArr.push(urlData[i].value.data);
        }
        // else if (urlData[i].status === 'rejected') {
        //   dataArr.push(dataIfNull);
        // }
      }
      // return { urlToVerify, dataArr };
      console.log("third check");
      start = loopIterations + 1;
      if (loopIterations == urls.length) {
        break;
      }
      difference = difference + 1000;

      if (difference <= urls.length) {
        loopIterations = difference;
      } else {
        console.log("else calls ", loopIterations);
        loopIterations = urls.length;
      }
    }
    // fs.writeFileSync('./metadata/urlData.json', JSON.stringify(dataArr));
    // ________________________     set Minting Address  ___________________
    // for (let i = 0; i < dataArr.length; i++) {
    //   dataArr[i].mintAddress = mintAddArr[i];
    // }
    for (let i = 0; i < urlToVerify.length; i++) {
      for (let j = 0; j < urls.length; j++) {
        if (urlToVerify[i] === urls[j]) {
          dataArr[i].mintAddress = data.mintAddress[j];
        }
      }
    }
    // ________________________     Setting Data Rarity  ___________________
    let occurArray = [];
    let singleOccuranceRarity = 0.0;
    let tempDel;
    singleOccuranceRarity = 100 / dataArr.length;
    // _____________________________________________________  getting individual score
    for (let i = 0; i < dataArr.length; i++) {
      // if (dataArr[i].name !== 'no data found') {
      for (let j = 0; j < dataArr[i].attributes.length; j++) {
        let count = 1,
          flag = 0;
        if (occurArray.length > 0) {
          flag = 0;
        } else {
          for (let index = 0; index < occurArray.length; index++) {
            if (
              dataArr[i].attributes[j].value === occurArray[index].value &&
              dataArr[i].attributes[j].trait_type ===
                occurArray[index].trait_type
            ) {
              flag = 1;
              break;
            }
          }
        }
        if (!flag) {
          for (let k = 1 + i; k < dataArr.length; k++) {
            for (let h = 0; h < dataArr[k].attributes.length; h++) {
              if (
                dataArr[i].attributes[j].value ==
                  dataArr[k].attributes[h].value &&
                dataArr[i].attributes[j].trait_type ==
                  dataArr[k].attributes[h].trait_type &&
                dataArr[k].attributes[j] != null
              ) {
                count++;
                // console.log("\n\n", array[k].attributes[j], i, j, k);
              }
            }
          }
          // set update formula of ranking
          // console.log("counts : ",count);
          tempDel = singleOccuranceRarity * count;
          occurArray.push({
            trait_type: dataArr[i].attributes[j].trait_type,
            value: dataArr[i].attributes[j].value,
            occurance: count,
            score: 100 - tempDel,
          });
        }
        // }
      }
    }
    // _____________________________________________________  assign individual Score
    for (let i = 0; i < dataArr.length; i++) {
      // if (dataArr[i].name !== 'no data found') {
      try {
        let check = dataArr[i].name.length;
        if (check === 0) {
          dataArr[i].name = `${i}`;
        }
      } catch (err) {
        dataArr[i].name = `${i}`;
      }

      let sum = 0;
      for (let j = 0; j < dataArr[i].attributes.length; j++) {
        for (let k = 0; k < occurArray.length; k++) {
          if (
            dataArr[i].attributes[j].value === occurArray[k].value &&
            dataArr[i].attributes[j].trait_type === occurArray[k].trait_type
          ) {
            dataArr[i].attributes[j].occurance = occurArray[k].occurance;
            dataArr[i].attributes[j].score = occurArray[k].score;
            break;
          }
        }
        // sum += array[i].attributes[j].score;
      }
      // console.log("score:", 100 - sum);
      // array[i].nftScore = 100 - sum;
      // }
    }
    // _____________________________________________________  Nft Score
    for (let i = 0; i < dataArr.length; i++) {
      let sum = 0.0;
      // console.log(i);
      // if (dataArr[i].name !== 'no data found') {
      for (let j = 0; j < dataArr[i].attributes.length; j++) {
        // console.log(j);
        sum += dataArr[i].attributes[j].score;
      }
      dataArr[i].nftScore = sum;
      // }
    }
    // return dataArr;
    // _____________________________________________________  DB operations
    const createdCollection = await this.db.marketplaceCollection.create({
      data: {
        name: collectionName,
        description: dataArr[0].description,
        projectType: "solana",
        contractAddress: dto.creartorAddress,
        collectionAddress: dto.collectionAddress,
        quantity: dataArr.length,
        isActive: true,
        SFBP: dataArr[0].seller_fee_basis_points,
        externalUrl: dataArr[0].externalUrl,
        UserId: dto.userId,
      },
    });
    let createdNft = null;
    for (let i = 0; i < dataArr.length; i++) {
      createdNft = await this.db.marketplaceNft.create({
        data: {
          name: dataArr[i].name,
          img: dataArr[i].image,
          score: dataArr[i].nftScore,
          symbol: dataArr[i].symbol,
          mintAddress: dataArr[i].mintAddress,
          imgTokenId: i,
          launchpadProjectId: null,
          marketplaceCollectionId: createdCollection.id,
        },
      });
      for (let j = 0; j < dataArr[i].attributes.length; j++) {
        await this.db.marketplaceAttributes.create({
          data: {
            trait_type: dataArr[i].attributes[j].trait_type,
            value: dataArr[i].attributes[j].value,
            marketplaceNftId: createdNft.id,
          },
        });
      }
    }
    // //________________________________________________ sorting json array
    for (let i = 0; i < dataArr.length; i++) {
      for (let j = 1 + i; j < dataArr.length; j++) {
        if (dataArr[i].nftScore > dataArr[j].nftScore) {
          let tempStore = dataArr[i];
          dataArr[i] = dataArr[j];
          dataArr[j] = tempStore;
        }
      }
    }
    // ___________________________________________________  rank
    for (let i = 0; i < dataArr.length; i++) {
      dataArr[i].rank = i + 1;
      await this.db.marketplaceNft.updateMany({
        data: { rank: i + 1 },
        where: { img: dataArr[i].image },
      });
    }
    fs.writeFileSync(
      `./metadata/finalmetdata/sol.json`,
      JSON.stringify(dataArr)
    );
    return dataArr;
  }
  async findAll() {
    let data = [];
    // for (let i = 0; i < 10; i++) {
    //   data.push(await this.db.marketpalceNft.findMany({ where: { rank: i } }));
    // }
    // data = await this.db.marketpalceNft.findMany();
    // return data;
    return "get all api";
  }

  async marketplaceCollection(query: querymarketplaceDTO) {
    try {
      const { collections, contractAddress, nftId, userId } = query;
      if (collections === "true") {
        console.log("IN first");
        var allcollections = await this.db.marketplaceCollection.findMany({
          include: {
            _count: {
              select: {
                watchList: true,
              },
            },
          },
        });
        console.log("collection", allcollections);
        if (userId == undefined) {
          console.log("IN USEr not define");
          return {
            data: allcollections,
            totalCollections: allcollections.length,
            message: `All collections`,
            success: true,
          };
        }
        const userwatchlist = await this.db.watchList.findMany({
          where: {
            userId,
          },
        });
        for (let item of userwatchlist) {
          for (let collection of allcollections) {
            if (item.marketplaceCollectionId === collection.contractAddress) {
              collection["isFavourite"] = true;
              //   break;
            } else {
              if (collection["isFavourite"] === true) {
                collection["isFavourite"] = true;
              } else {
                collection["isFavourite"] = false;
              }
            }
          }
        }

        return {
          data: allcollections,
          totalCollections: allcollections.length,
          message: `All collections  `,
          success: true,
        };
      }

      if (contractAddress && nftId) {
        let collectionsnft = await this.db.marketplaceCollection.findUnique({
          where: {
            contractAddress: contractAddress,
          },
          include: {
            marketplaceFeatured: true,
            marketplaceNft: {
              where: {
                imgTokenId: nftId,
              },
              include: {
                _count: {
                  select: {
                    wishList: true,
                  },
                },
                marketplaceAttributes: true,
                marketplaceorder: {
                  where: {
                    isactive: true,
                  },
                },
                marketplaceAuction: {
                  where: {
                    isactive: true,
                  },
                  include: {
                    marketplaceBidding: {
                      orderBy: {
                        highestBid: "desc",
                      },
                    },
                  },
                },

                marketplaceOffer: {
                  orderBy: {
                    amount: "desc",
                  },
                },
              },
            },
          },
        });
        console.log("THIS IS NFT", collectionsnft);
        if (collectionsnft.marketplaceNft.length <= 0) {
          throw new HttpException("No data", HttpStatus.NO_CONTENT);
        }
        var activity = [];
        for (let onecollection of collectionsnft.marketplaceNft[0]
          .marketplaceorder) {
          onecollection["Event"] = "List";
          activity.push(onecollection);
        }
        for (let onecollection of collectionsnft.marketplaceNft[0]
          .marketplaceAuction) {
          onecollection["Event"] = "Auction";
          activity.push(onecollection);
        }
        for (let onecollection of collectionsnft.marketplaceNft[0]
          .marketplaceOffer) {
          onecollection["Event"] = "Offer";
          activity.push(onecollection);
        }
        // activity.sort(function(a,b){return a() - b.getTime()});

        const sortedDesc = activity.sort(
          (objA, objB) => Number(objB.created_at) - Number(objA.created_at)
        );
        if (!collectionsnft) {
          return {
            data: [],
            message: "Invalid NFT ID or Contract Address",
            error: null,
          };
        }
        collectionsnft["Activity"] = sortedDesc;
        // collectionsnftfinal['marketplaceNft'] = collectionsnftfinal.marketplaceNft[0];

        let randomnumber: number[] = [];
        while (randomnumber.length < 4) {
          let nftid = Math.floor(Math.random() * collectionsnft.quantity);
          if (!randomnumber.includes(nftid)) randomnumber.push(nftid);
        }
        console.log("soerted Array ", sortedDesc);
        if (sortedDesc.length <= 0) {
          collectionsnft["listingType"] = "Unlisted";
        } else if (
          sortedDesc[0].Event === "Auction" &&
          sortedDesc[0].isactive === true
        ) {
          collectionsnft["listingType"] = "Auction";
        } else if (
          sortedDesc[0].Event === "List" &&
          sortedDesc[0].isactive === true
        ) {
          collectionsnft["listingType"] = "Listed";
        } else {
          collectionsnft["listingType"] = "Unlisted";
        }
        const cards = await this.db.marketplaceNft.findMany({
          where: {
            imgTokenId: { in: randomnumber },
          },
        });
        return {
          data: collectionsnft,
          randomNfts: cards,
          message: `NFT Details  `,
          success: true,
        };
      }

      if (contractAddress) {
        console.log("IN second");
        let iscollection = await this.db.marketplaceCollection.findUnique({
          where: {
            contractAddress: contractAddress,
          },
          include: {
            marketplaceFeatured: true,
            marketplaceNft: {
              orderBy: {
                imgTokenId: "asc",
              },
              include: {
                _count: {
                  select: {
                    wishList: true,
                  },
                },
                marketplaceAttributes: true,
                marketplaceorder: {
                  where: {
                    isactive: true,
                  },
                },
                marketplaceAuction: {
                  where: {
                    isactive: true,
                  },
                  include: {
                    marketplaceBidding: {
                      orderBy: {
                        highestBid: "desc",
                      },
                    },
                  },
                },

                marketplaceOffer: {
                  orderBy: {
                    amount: "desc",
                  },
                },
              },
            },
          },
        });

        if (!iscollection) {
          return {
            data: [],
            message: "Collection Not found ",
            error: null,
          };
        }
        var traits = [];
        for (let nft of iscollection.marketplaceNft) {
          for (let attribute of nft.marketplaceAttributes) {
            let data = traits.find(
              (element) => element.trait == attribute.trait_type
            );
            if (data) {
              for (let item of traits) {
                if (item.trait == attribute.trait_type) {
                  let data = item.value.find(
                    (element) => element == attribute.value
                  );
                  if (!data) {
                    item.value.push(attribute.value);
                    item.total = item.total + 1;
                  }
                }
              }
            }
            if (!data) {
              // var values = attribute.value;

              let obj = {
                trait: attribute.trait_type,
                value: [attribute.value],
                total: 1,
              };
              traits.push(obj);
            }
          }
        }
        for (let item of iscollection.marketplaceNft) {
          if (item.marketplaceorder.length > 0) {
            item["listingType"] = "Listed";
          } else if (item.marketplaceAuction.length > 0) {
            item["listingType"] = "Auction";
          } else {
            item["listingType"] = "Unlisted";
          }
        }
        return {
          data: iscollection,
          traits: traits,
          message: `Collection details with all trait and Attributes `,
          success: true,
        };
      }
    } catch (error) {
      if (error.status === 204) {
        throw new HttpException(error.message, HttpStatus.NO_CONTENT);
      } else {
        return new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      //return error;
    }
  }

  async marketplaceWishList(body: wishListmarketplaceDTO) {
    try {
      const isnft = await this.db.marketplaceNft.findMany({
        where: {
          marketplaceCollectionId: body.contractAddress,
          id: body.nftuuid,
        },
      });

      if (isnft.length <= 0) {
        throw new HttpException("No data", HttpStatus.NO_CONTENT);
      }
      const iswatchedListed = await this.db.wishList.findMany({
        where: {
          marketplaceCollectionId: body.contractAddress,
          userId: body.userId,
          marketplaceNftId: body.nftuuid,
        },
      });
      if (iswatchedListed.length > 0) {
        const deleteWishListItem = await this.db.wishList.deleteMany({
          where: {
            marketplaceCollectionId: body.contractAddress,
            userId: body.userId,
            marketplaceNftId: body.nftuuid,
          },
        });

        return {
          data: [],
          message: "NFT is removed from your wishlist",
          error: null,
        };
      } else {
        const addWishListItem = await this.db.wishList.create({
          data: {
            marketplaceCollectionId: body.contractAddress,
            userId: body.userId,
            marketplaceNftId: body.nftuuid,
          },
        });

        if (addWishListItem) {
          return {
            data: [],
            message: "NFT is added to your wishlist",
            error: null,
          };
        }
      }
    } catch (error) {
      if (error.status === 204) {
        throw new HttpException(error.message, HttpStatus.NO_CONTENT);
      } else {
        return new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      //return error;
    }
  }
  async marketplaceWatchList(body: watchListmarketplaceDTO) {
    try {
      const iscollection = await this.db.marketplaceCollection.findUnique({
        where: {
          contractAddress: body.contractAddress,
        },
      });

      if (!iscollection) {
        throw new HttpException("No data", HttpStatus.NO_CONTENT);
      }
      const iswatchedListed = await this.db.watchList.findMany({
        where: {
          marketplaceCollectionId: body.contractAddress,

          // marketplaceCollectionId: body.contractAddress,
          userId: body.userId,
        },
      });
      if (iswatchedListed.length > 0) {
        const deleteWatchListItem = await this.db.watchList.deleteMany({
          where: {
            marketplaceCollectionId: body.contractAddress,

            // marketplaceCollectionId: body.contractAddress,
            userId: body.userId,
          },
        });
        return {
          data: [],
          message: "Collection is removed from your Watchlist",
          error: null,
        };
      } else {
        const addWatchListItem = await this.db.watchList.create({
          data: {
            marketplaceCollectionId: body.contractAddress,
            userId: body.userId,
          },
        });

        if (addWatchListItem) {
          return {
            data: [],
            message: "Collection is added to your Watchlist",
            error: null,
          };
        }
      }
    } catch (error) {
      console.log(error.message);
      if (error.status === 204) {
        throw new HttpException(error.message, HttpStatus.NO_CONTENT);
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      //return error;
    }
  }

  async generateabi(contractAddress: string) {
    let ABI = [];
    try {
      await axios
        .get(
          `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=IFEIBES8UD4X7AQ27V6XKQIXQR66A1SM7Q`
        )
        .then((response) => {
          ABI = JSON.parse(response.data.result);
        });
      return ABI;
    } catch (error) {
      console.log(error);
      return abitest;
    }
  }

  async createCollection(dto: MarketplaceCollectionDto) {
    const checkIfExist = await this.db.metadataRanking.findMany({
      where: {
        OR: [
          { name: { contains: dto.contractAddress } },
          { contractAddress: { contains: dto.contractAddress } },
        ],
      },
      select: {
        contractAddress: true,
        data: false,
        totalSupply: true,
        imgUrl: true,
        name: true,
      },
    });
    console.log(checkIfExist);

    if (checkIfExist.length > 0) {
      return checkIfExist;
    }

    let responseofOpenSea = null;
    let ipfsUrlOne = "https://ipfs.io/ipfs";
    let ipfsUrlTwo = "ipfs://";
    let pinataUrlThird = ".mypinata.cloud/ipfs";
    let pinataUrlFourth = ".pinata.cloud/ipfs";
    let jsonFormat = 0,
      notjsonFormat = 0,
      jsonFormatElse = 0,
      notJsonFormatElse = 0,
      singleOccuranceRarity = 0.0;
    console.log(
      "\n\t",
      "____________ +FILE SAVE START+ _____________________",
      "\n"
    );
    try {
      console.log("in");
      responseofOpenSea = await axios.get(
        `https://api.opensea.io/api/v1/asset_contract/${dto.contractAddress}`,
        {
          headers: {
            "X-API-KEY": process.env.X_API_KEY,
          },
        }
      );

      console.log("2nd");
      let clientContractAddress = null,
        responseOfContract = null,
        getData = null,
        totalSupply = null;
      clientContractAddress = dto.contractAddress;

      if (!clientContractAddress) {
        console.log("in the err");
        throw new Error("invalid contract Address");
      }
      let start;
      let loopStartTopTen;
      console.log("3rd getting contract...ABI");

      //get the contract abi
      let abi = await this.generateabi(dto.contractAddress);

      let web3 = new Web3(process.env.INFRA_URL);
      console.log("4rth");

      const ct = await new web3.eth.Contract(abi, clientContractAddress);
      console.log("6th");

      totalSupply = await ct.methods.totalSupply().call();

      singleOccuranceRarity = 100 / totalSupply;
      if (!totalSupply) {
        throw new Error("total supply is not mentioned in your contract");
      }

      let elseCallsCheck = 0;
      try {
        responseOfContract = await ct.methods.tokenURI(0).call();
        console.log(responseOfContract);

        if (JSON.stringify(responseOfContract).search("/0.json") > 0) {
          jsonFormat = 1;
        } else if (JSON.stringify(responseOfContract).search("/0") > 0) {
          notjsonFormat = 1;
        }
        let ipfsCheckTwo = JSON.stringify(responseOfContract).substring(1, 8);
        let ipfsCheckOne = JSON.stringify(responseOfContract).substring(1, 21);
        let pinataCheckThird = JSON.stringify(responseOfContract).search(
          ".mypinata.cloud/ipfs"
        );
        let pinataCheckFourth =
          JSON.stringify(responseOfContract).search(".pinata.cloud/ipfs");
        console.log(pinataCheckFourth);

        if (ipfsCheckTwo === ipfsUrlTwo) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            8,
            54
          );
          console.log("\n inside Zero Url Second Check\n", responseOfContract);
        } else if (ipfsCheckOne === ipfsUrlOne) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            22,
            69
          );
          console.log("\n inside Zero Url First Check\n", responseOfContract);
        } else if (pinataCheckThird > 0) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            pinataCheckThird + 21,
            pinataCheckThird + 21 + 46
          );
          console.log("\n inside Zero Url Third Check\n", responseOfContract);
        } else if (pinataCheckFourth > 0) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            pinataCheckFourth + 19,
            pinataCheckFourth + 19 + 46
          );
          console.log("\n inside Zero Url Fourth Check\n", responseOfContract);
        } else {
          jsonFormatElse = 1;

          console.log("\n inside Zero Url Else Check\n", responseOfContract);
        }
        start = 0;
        totalSupply = totalSupply - 1;
      } catch (err) {
        responseOfContract = await ct.methods.tokenURI(1).call();
        console.log(
          "\n\n _______________ url One _______________________ ",
          responseOfContract,
          "\n"
        );
        //  check if format is JSON or not
        if (JSON.stringify(responseOfContract).search("/1.json") > 0) {
          jsonFormat = 1;
        } else if (JSON.stringify(responseOfContract).search("/1") > 0) {
          notjsonFormat = 1;
        }
        // end

        // check if url is ipfs or pinata
        let ipfsCheckTwo = JSON.stringify(responseOfContract).substring(1, 8);
        let ipfsCheckOne = JSON.stringify(responseOfContract).substring(1, 21);
        let pinataCheckThird = JSON.stringify(responseOfContract).search(
          ".mypinata.cloud/ipfs"
        );
        let pinataCheckFourth =
          JSON.stringify(responseOfContract).search(".pinata.cloud/ipfs");
        if (ipfsCheckTwo === ipfsUrlTwo) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            8,
            54
          );
          console.log("\n inside One second Check \n", responseOfContract);
        } else if (ipfsCheckOne === ipfsUrlOne) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            22,
            69
          );
          console.log("\n inside One first Check \n", responseOfContract);
        } else if (pinataCheckThird > 0) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            pinataCheckThird + 21,
            pinataCheckThird + 21 + 46
          );
          console.log("\n inside Zero Url Third Check\n", responseOfContract);
        } else if (pinataCheckFourth > 0) {
          responseOfContract = JSON.stringify(responseOfContract).substring(
            pinataCheckFourth + 19,
            pinataCheckFourth + 19 + 46
          );
          console.log("\n inside Zero Url Fourth Check\n", responseOfContract);
        } else {
          jsonFormatElse = 1;
        }
        // end here
        start = 1;
      }
      let imgIndexStart = start;
      loopStartTopTen = start;
      if (jsonFormatElse) {
        responseOfContract = responseOfContract.split(`/${start}`)[0];
      }
      console.log("res", responseOfContract);
      console.log("total supply", totalSupply);
      console.log("start point", start);
      console.log("IsJson", jsonFormat);
      console.log("notJson", notjsonFormat);
      console.log("else check", jsonFormatElse);

      // Start
      let apiArray = [],
        loopIterations = 0,
        flag = 0;
      let difference = 1000;
      if (totalSupply <= 1000) {
        loopIterations = totalSupply;
      } else {
        loopIterations = difference;
      }
      const jsons = null;
      var responseOfApis = [];
      var testArray = [];
      console.log(responseOfContract);

      // ends
      if (jsonFormat) {
        while (1) {
          for (start; start <= loopIterations; start++) {
            if (!jsonFormatElse) {
              console.log(
                "JSON Format",
                `${process.env.IPFS_GATEWAY}/${responseOfContract}/${start}.json`,
                "\n"
              );
              apiArray.push(
                axios.get(
                  `${process.env.IPFS_GATEWAY}/${responseOfContract}/${start}.json`
                )
              );
            } else if (jsonFormatElse) {
              console.log(
                "JSON format else",
                `${responseOfContract}/${start}.json`,
                "\n"
              );
              apiArray.push(axios.get(`${responseOfContract}/${start}.json`));
            }
          }

          const response = await Promise.allSettled(apiArray);
          const res2 = await response;
          let dataTemp = [];
          for (let i = 0; i < response.length; i++) {
            if (response[i].status === "fulfilled") {
              dataTemp.push(response[i]);
            }
          }
          for (let i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i].status === "fulfilled") {
              responseOfApis.push(dataTemp[i].value.data);
            }
          }

          apiArray = [];
          start = loopIterations + 1;
          if (loopIterations == totalSupply) {
            break;
          }
          difference = difference + 1000;

          if (difference <= totalSupply) {
            loopIterations = difference;
          } else {
            console.log("else calls ", loopIterations);
            loopIterations = totalSupply;
          }
          console.log("difference", difference, "total supply", totalSupply);
        }
      } else if (notjsonFormat) {
        while (1) {
          for (start; start <= loopIterations; start++) {
            if (!jsonFormatElse) {
              apiArray.push(
                axios.get(
                  `${process.env.IPFS_GATEWAY}/${responseOfContract}/${start}`
                )
              );
              console.log(
                "first not Json true",
                `${process.env.IPFS_GATEWAY}/${responseOfContract}/${start}`,
                "\n"
              );
            } else if (jsonFormatElse) {
              apiArray.push(axios.get(`${responseOfContract}/${start}`));
              console.log(
                "second not json Format",
                `${responseOfContract}/${start}`,
                "\n"
              );
            }
          }

          const response = await Promise.all(apiArray);
          let responseArray = [];
          responseArray = await Promise.all(
            response.map(async (r) => await r.data)
          );
          responseOfApis.push(...responseArray);

          apiArray = [];
          start = loopIterations + 1;
          if (loopIterations == totalSupply) {
            break;
          }
          difference = difference + 1000;

          if (difference <= totalSupply) {
            loopIterations = difference;
          } else {
            console.log("else calls ", loopIterations);
            loopIterations = totalSupply;
          }
          console.log("difference", difference, "total supply", totalSupply);
        }
      }

      console.log("LoopStart Top ten", loopStartTopTen);
      console.log("response of apis length 2", responseOfApis.length);
      let checkerInsideLoop = 0;
      let typeOfImg = null;
      let index = loopStartTopTen;
      for (let i = 0; i < responseOfApis.length; i++) {
        responseOfApis[
          i
        ].openseaLink = `${process.env.OPENSEA_GATEWAY}${clientContractAddress}/${index}`;
        index++;
        if (checkerInsideLoop == 0) {
          typeOfImg = responseOfApis[i].image;

          let ipfsCheckTwo = JSON.stringify(typeOfImg).substring(1, 8);
          let ipfsCheckOne = JSON.stringify(typeOfImg).substring(1, 21);
          let pinataCheckThird = JSON.stringify(typeOfImg).search(
            ".mypinata.cloud/ipfs"
          );
          let pinataCheckFourth =
            JSON.stringify(typeOfImg).search(".pinata.cloud/ipfs");
          // check if Format is json or not

          if (ipfsCheckTwo === ipfsUrlTwo) {
            typeOfImg = JSON.stringify(typeOfImg).substring(8);
          } else if (ipfsCheckOne === ipfsUrlOne) {
            typeOfImg = JSON.stringify(typeOfImg).substring(22);
          } else if (pinataCheckThird > 0) {
            typeOfImg = JSON.stringify(typeOfImg).substring(
              pinataCheckThird + 21
            );
          } else if (pinataCheckFourth > 0) {
            typeOfImg = JSON.stringify(typeOfImg).substring(
              pinataCheckFourth + 19
            );
          }
        }
        typeOfImg = typeOfImg.replace(/(^"|"$)/g, "");
        if (!jsonFormatElse) {
          responseOfApis[i].image = `${process.env.IPFS_GATEWAY}/${typeOfImg}`;
        }
      }

      let array = [];

      array = await rankFunctions.prototype.getRankedNfts(responseOfApis);

      let firstSum = 0,
        secondSum = 0,
        firstAtt = 0,
        secondAtt = 0;
      fs.writeFileSync(`./metadata/rankedMetadata.json`, JSON.stringify(array));
      // __________________________    DB STORE _________________________________
      const convertTOStringfy = JSON.stringify(array);
      await this.db.metadataRanking.create({
        data: {
          contractAddress: dto.contractAddress,
          name: responseofOpenSea.data.collection.name,
          data: convertTOStringfy,
          imgUrl: responseofOpenSea.data.collection.featured_image_url,
          totalSupply: JSON.stringify(totalSupply),
        },
      });

      if (loopStartTopTen == 0) {
        loopStartTopTen = 1;
      }
      let topTenNft = [];
      for (let i = loopStartTopTen; i <= 10; i++) {
        topTenNft.push(array[i]);
      }

      console.log("\n\n end here \n\n");
      return true;
    } catch (err) {
      console.log(err);
    }
  }
}
