import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateSharedApiDto,
  GlobalSearch,
  MarketPlaceCollectionFilter,
  transactionHash,
} from "./dto/create-shared-api.dto";
import { UpdateSharedApiDto } from "./dto/update-shared-api.dto";
import { Response } from "express";
import { PrismaException } from "src/prisma/prismaExceptions/prismaExceptions";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import {
  CreateMarketplaceDto,
  MarketplaceCollectionDto,
} from "src/marketplace/dto/create-marketplace.dto";
import abitest from "../../src/abi.json";
import {
  Calendar,
  marketplaceCollection,
  marketplaceNft,
  User,
} from "@prisma/client";
const Web3 = require("web3");
const fs = require("fs");
@Injectable()
export class SharedApiService {
  constructor(private db: PrismaService, private config: ConfigService) {}
  private web3 = new Web3(
    Web3.givenProvider ||
      "https://eth-mainnet.g.alchemy.com/v2/fxWlGAniS1bHE-OWHjT8hnO4Jf-V8sBU"
  );
  async findallBloackchain(response: Response) {
    try {
      let allBloackchain = await this.db.blockchainType.findMany({});
      if (allBloackchain) {
        response.status(HttpStatus.OK).json(allBloackchain);
      } else {
        throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async getTransactionDetailsFromGeoriliTestnet(
    transactionHash: string,
    response: Response
    // orderId:string
  ) {
    const apiKey = this.config.get("Testnet_API_KEY");
    var options = {
      id: 1,
      jsonrpc: "2.0",
      params: [transactionHash],
      method: "eth_getTransactionByHash",
    };
    const url = `https://eth-goerli.g.alchemy.com/v2/${apiKey}`;
    let data: transactionHash = await (
      await axios.post(url, options)
    ).data.result;

    let transactionDetails = {
      to: data.to,
      from: data.from,
      gas: this.hexValueToEthValue(data.gas),
      gasPrice: this.hexValueToEthValue(data.gasPrice),
      blockNumber: this.hexValueTodecimal(data.blockNumber),
      value: this.hexValueToEthValue(data.value),
      TimeStamp: await this.getTimeStampfromblockNumber(
        Number(data.blockNumber)
      ),
    };

    // await this.prisma.marketplaceOrder.update({
    //   where:{
    //     id:orderId
    //   },
    //   data:{

    //   }
    // })

    response.status(HttpStatus.OK).json(transactionDetails);
  }

  async getTransactionDetailsFromEthriumMainnet(
    transactionHash: string,
    response: Response
  ) {
    const apiKey = this.config.get("Mainnet_APPI_KEY");
    var options = {
      id: 1,
      jsonrpc: "2.0",
      params: [transactionHash],
      method: "eth_getTransactionByHash",
    };
    const url = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
    let data: transactionHash = await (
      await axios.post(url, options)
    ).data.result;
    console.log(data);
    let transactionDetails = {
      to: data.to,
      from: data.from,
      gas: this.hexValueToEthValue(data.gas),
      gasPrice: this.hexValueToEthValue(data.gasPrice),
      blockNumber: this.hexValueTodecimal(data.blockNumber),
      value: this.hexValueToEthValue(data.value),
      TimeStamp: await this.getTimeStampfromblockNumber(
        Number(data.blockNumber)
      ),
    };

    response.status(HttpStatus.OK).json(transactionDetails);
  }

  hexValueToEthValue(hexvalue: string) {
    const hexString = hexvalue;
    const decimalNumber = Number(hexString);
    return decimalNumber / Math.pow(10, 18);
  }

  hexValueTodecimal(hexvalue: string) {
    const hexString = hexvalue;
    return Number(hexString);
  }

  async getTimeStampfromblockNumber(blockNumber: number) {
    let blockdata = await this.web3.eth.getBlock(blockNumber);
    return blockdata.timestamp;
  }

  ////

  async createEthCollection(dto: CreateMarketplaceDto, response: Response) {
    console.log("Contract Address", dto.contractAddress);
    try {
      let isContractAddress = await this.db.marketplaceCollection.findUnique({
        where: {
          contractAddress: dto.contractAddress,
        },
      });
      if (isContractAddress) {
        return response.status(HttpStatus.OK).json({
          message: "Contract Address already exists",
        });
      }

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
      console.log("retunn abi", abi);
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

          const response = await Promise.allSettled(apiArray);

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
          const response = await Promise.allSettled(apiArray);
          let dataTemp = [];
          for (let i = 0; i < response.length; i++) {
            if (response[i].status === "fulfilled") {
              dataTemp.push(response[i]);
            } else if (response[i].status === "rejected") {
              dataTemp.push({ status: response[i].status });
              console.log(response[i]);
            }
          }

          for (let i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i].status === "fulfilled") {
              responseOfApis.push(dataTemp[i].value.data);
            } else if (dataTemp[i].status === "rejected") {
              responseOfApis.push(rejectedApiData);
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
            loopIterations = totalSupply;
          }
          console.log("difference", difference, "total supply", totalSupply);
        }
      }

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

      if (!fs.existsSync(`./public/collection/${dto.contractAddress}/`)) {
        fs.mkdirSync(`./public/collection/${dto.contractAddress}/`, {
          recursive: true,
        });
      }
      console.log(responseOfApis);

      fs.writeFileSync(
        `./public/collection/${dto.contractAddress}/metadata.json`,
        JSON.stringify(responseOfApis)
      );
      // //________________________________________________ set rarity in an array

      let array = responseOfApis;
      console.log(
        "--------------------------------DB Operation--------------------------------"
      );
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
      console.log("collection created successfully", insertedCollection.id);
      let insertedNft = null;
      for (let i = 0; i < array.length; i++) {
        insertedNft = await this.db.marketplaceNft.create({
          data: {
            name: array[i].name,
            img: array[i].image,
            description: array[i].description,
            imgTokenId: i + 1,

            launchpadProjectId: "",
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

      console.log("\n\n end here \n\n");
      return response.status(HttpStatus.OK).json(array);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async generateabi(contractAddress: string) {
    let ABI = [];
    console.log(abitest);
    let MianNetUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=IFEIBES8UD4X7AQ27V6XKQIXQR66A1SM7Q`;
    let TestNetUrl = `https://goerli.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=IFEIBES8UD4X7AQ27V6XKQIXQR66A1SM7Q`;

    try {
      await axios
        .get(MianNetUrl)
        .then((response) => {
          ABI = JSON.parse(response.data.result);
        })
        .catch((error) => {
          console.log("error");
          ABI = abitest;
        });
      console.log(ABI);
      return ABI;
    } catch (error) {
      console.log(error);
    }
  }

  async checkContractNetwork(dto: CreateMarketplaceDto, response: Response) {
    this.web3.eth.net.getId().then((networkId) => {
      console.log(networkId);
      if (networkId === 1) {
        console.log("Mainnet");
      } else if (networkId === 4) {
        console.log("Rinkeby Testnet");
      } else {
        console.log("Unknown network");
      }
    });
  }

  async globalsearch(search: GlobalSearch, response: Response) {
    try {
      let results = await Promise.all([
        this.searchMarketplaceCollection(search.query.trim()),
        this.searchCalendar(search.query.trim()),
        this.searchMarketplaceNFT(search.query.trim()),
        this.searchAccounts(search.query.trim()),
      ]);
      if (results) {
        return response.status(HttpStatus.OK).json({
          Collections: results[0],
          Calendars: results[1],
          NFTs: results[2],
          Accounts: results[3],
        });
      }
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }

  async searchMarketplaceCollection(query: string) {
    if (query.length == 42) {
      // console.log("in collection");
      let checkifwallet = await this.web3.eth.getCode(query);
      //  console.log(checkifwallet.length);
      if (checkifwallet) {
        //  console.log(query);
        const results = await this.db.marketplaceCollection.findMany({
          select: {
            id: true,
            name: true,
            ProfileImage: true,
          },
          where: {
            contractAddress: {
              contains: query,
              mode: "insensitive",
            },
          },
        });
        // console.log("Collection", results);
        return results;
      }
    } else {
      const results = await this.db.marketplaceCollection.findMany({
        select: {
          id: true,
          name: true,
          ProfileImage: true,
        },
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      });
      // console.log("Collection", results);
      return results;
    }
  }
  async searchMarketplaceNFT(query: string) {
    // console.log("nft");
    const results = await this.db.marketplaceNft.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        img: true,
      },
    });
    // console.log("marketplaceNFT", results);
    return results;
  }
  async searchCalendar(query: string) {
    //  console.log("calendar", query);
    const results = await this.db.calendar.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        profileImage: true,
      },
    });
    // console.log("Calendar", results);
    return results;
  }
  async searchAccounts(query: string) {
    // console.log("in Account", query.length);
    if (query.length == 42) {
      let checkifwallet = await this.web3.eth.getCode(query);

      if (checkifwallet === "0x") {
        const results = await this.db.wallet.findMany({
          where: {
            walletAddress: {
              contains: query,
              mode: "insensitive",
            },
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profileImage: true,
              },
            },
          },
        });
        // console.log("Accounts", results);
        return results[0].user;
      }
      return [];
    } else {
      const results = await this.db.user.findMany({
        select: {
          id: true,
          username: true,
          profileImage: true,
        },
        where: {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
      });
      //  console.log("Collection", results);
      return results;
    }
  }
  // collection filtering

  async marketplaceCollectionFilter(
    query: MarketPlaceCollectionFilter,
    response: Response
  ) {
    try {
      const { attribute } = query;
      let pageNo: number | undefined =
        query.pageNo == undefined ? 0 : query?.pageNo;
      let limit: number | undefined =
        query.limit == undefined ? 0 : query?.limit;
      let calendarCount = await this.db.marketplaceNft.aggregate({
        where: {
          marketplaceCollection: {
            contractAddress: query.collectionAddress,
          },
        },
        _count: {
          _all: true,
        },
      });
      response.status(HttpStatus.OK).json({ calendarCount });
      // let marketplaceCollections = await this.db.marketplaceNft.findMany({
      //   where:{
      //     marketplaceAttributes:{
      //       where:{

      //       }
      //     }
      //   }
      // });
    } catch (error) {
      PrismaException.prototype.findprismaexception(error, response);
    }
  }
}
