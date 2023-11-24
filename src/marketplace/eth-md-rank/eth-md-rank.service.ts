import { HttpException, Injectable } from "@nestjs/common";
import { CreateEthMdRankDto } from "./dto/create-eth-md-rank.dto";
import { UpdateEthMdRankDto } from "./dto/update-eth-md-rank.dto";
const Web3 = require("web3");
// import Web3 from 'web3';
// const fs = require('fs');
import fs from "fs";
import { Connection, PublicKey } from "@solana/web3.js";
const axios = require("axios").default;
import abi from "../../../src/abi.json";
import { ConfigService } from "@nestjs/config";
import { DbConnectionService } from "../../db-connection/db-connection.service";
// const { match } = require('assert');
import { match } from "assert";
import { rankFunctions } from "src/common/reuseable-component/rank-functions";

@Injectable()
export class EthMdRankService {
  constructor(private db: DbConnectionService, private config: ConfigService) {}

  async create(dto: CreateEthMdRankDto) {
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
      let clientContractAddress = null,
        responseOfContract = null,
        getData = null,
        totalSupply = null;
      clientContractAddress = dto.contractAddress;
      let start;
      let loopStartTopTen;
      let web3 = new Web3(process.env.INFRA_URL);
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
        responseOfApis[i].id = index;
        try {
          let check = responseOfApis[i].name.length;
          if (check === 0) {
            responseOfApis[i].name = `${index}`;
          }
        } catch (err) {
          responseOfApis[i].name = `${index}`;
        }
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
      console.log("\n\n\n db operation started __________________________");
      // ____________ db operations _________________
      const insertedCollection = await this.db.marketplaceCollection.create({
        data: {
          name: responseofOpenSea.data.collection.name,
          projectType: "ethereum",
          quantity: totalSupply,
          contractAddress: dto.contractAddress,
          description: responseofOpenSea.data.description,
          UserId: dto.userId,
          bannerImage: responseofOpenSea.data.collection.featured_image_url,
        },
      });
      console.log("first one inserted");
      for (let i = 0; i < responseOfApis.length; i++) {
        const insertedNft = await this.db.marketplaceNft.create({
          data: {
            name: responseOfApis[i].name,
            img: responseOfApis[i].image,
            // score: array[i].nftScore,
            description: responseOfApis[i].description,
            imgTokenId: i + 1,
            marketplaceCollectionId: insertedCollection.contractAddress,
            launchpadProjectId: null,
          },
        });
        for (let j = 0; j < responseOfApis[i].attributes.length; j++) {
          await this.db.marketplaceAttributes.create({
            data: {
              trait_type: responseOfApis[i].attributes[j].trait_type,
              value: responseOfApis[i].attributes[j].value,
              marketplaceNftId: insertedNft.id,
            },
          });
        }
      }
      //  __________________________  db ends +++++++
      //  __________________________ normalized ranking __________
      fs.writeFileSync(
        "./metadata/finalmetdata/responseOfApis.json",
        JSON.stringify(responseOfApis)
      );
      let nftsFinal = await rankFunctions.prototype.getRankedNfts(
        responseOfApis
      );
      // fs.writeFileSync(
      //   `./metadata/finalmetdata/nftsFinal.json`,
      //   JSON.stringify(nftsFinal),
      // );
      for (let i = 0; i < nftsFinal.length; i++) {
        await this.db.marketplaceNft.updateMany({
          data: { rank: nftsFinal[i].rarity_rank },
          where: { img: nftsFinal[i].image },
        });
      }

      console.log(" ______________________ operation ends");
    } catch (err) {
      throw new HttpException(err, 404);
    }
    return "This action adds a new ethMdRank";
  }

  async findAll() {
    try {
      const data = await this.db.marketplaceCollection.findMany({
        select: {
          name: true,
          projectType: true,
          quantity: true,
          contractAddress: true,
          description: true,
          marketplaceNft: {
            select: {
              name: true,
              description: true,
              img: true,
              rank: true,
              marketplaceAttributes: {
                select: {
                  trait_type: true,
                  value: true,
                },
              },
            },
            orderBy: [
              {
                rank: "asc",
              },
            ],
          },
        },
        where: { isActive: true },
      });
      return data;
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.db.marketplaceCollection.findMany({
        where: { name: id, isActive: true },
        select: {
          name: true,
          projectType: true,
          quantity: true,
          contractAddress: true,
          description: true,
          marketplaceNft: {
            select: {
              name: true,
              description: true,
              img: true,
              marketplaceAttributes: {
                select: {
                  trait_type: true,
                  value: true,
                },
              },
            },
          },
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(error, 404);
    }
  }

  update(id: number, updateEthMdRankDto: UpdateEthMdRankDto) {
    return `This action updates a #${id} ethMdRank`;
  }

  remove(id: number) {
    return `This action removes a #${id} ethMdRank`;
  }
}
