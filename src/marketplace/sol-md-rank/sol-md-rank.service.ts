import { HttpException, Injectable } from "@nestjs/common";
import { CreateSolMdRankDto } from "./dto/create-sol-md-rank.dto";
import { UpdateSolMdRankDto } from "./dto/update-sol-md-rank.dto";
const axios = require("axios").default;
import { Connection, PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import abi from "../../../src/abi.json";

import fs from "fs";
import { ConfigService } from "@nestjs/config";
import { DbConnectionService } from "../../db-connection/db-connection.service";
import { rankFunctions } from "src/common/reuseable-component/rank-functions";
const metadataProgramId = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const { match } = require("assert");

const METADATA_REPLACE = new RegExp("\u0000", "g");
// _________________________________ sol functions _________________________________

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
//  _________________________________ sol functions end _________________________________

//  _________________________________ ranking functions ___________________________________________

// __________________________________ end ____________________________________
@Injectable()
export class SolMdRankService {
  constructor(private db: DbConnectionService, private config: ConfigService) {}

  async create(dto: CreateSolMdRankDto) {
    try {
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
      fs.writeFileSync("./metadata/solUrls.json", JSON.stringify(urls));
      fs.writeFileSync(
        "./metadata/mintAddress.json",
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
        dataArr[i].id = i + 1;
      }
      //  _____________________________________
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
            marketplaceCollectionId: createdCollection.contractAddress,
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
      //  end
      // nfts = dataArr;

      // let { all_traits, attr_count } = await get_all_traits(dataArr);

      // let { all_traits: all_traits_stats, collection_stats } =
      //   get_stats(all_traits);

      // await add_normalized_rarities(all_traits_stats, collection_stats);

      // all_traits = all_traits_stats;

      // const nftsFinal = await set_nfts_rank(all_traits, attr_count);

      let nftsFinal = await rankFunctions.prototype.getRankedNfts(dataArr);
      for (let i = 0; i < nftsFinal.length; i++) {
        // dataArr[i].rank = i + 1;
        await this.db.marketplaceNft.updateMany({
          data: { rank: nftsFinal[i].rarity_rank },
          where: { mintAddress: nftsFinal[i].mintAddress },
        });
      }
      fs.writeFileSync(
        "./metadata/finalmetdata/sol.json",
        JSON.stringify(nftsFinal)
      );
      return true;
    } catch (err) {
      throw new HttpException(err, 404);
    }
  }

  findAll() {
    return `This action returns all solMdRank`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solMdRank`;
  }

  update(id: number, updateSolMdRankDto: UpdateSolMdRankDto) {
    return `This action updates a #${id} solMdRank`;
  }

  remove(id: number) {
    return `This action removes a #${id} solMdRank`;
  }
}
