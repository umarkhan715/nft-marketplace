import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class SearchService {
  constructor(private readonly db: PrismaService) {}

  async globalSearch(query: any) {
    const {
      data,
      collectionId,
      collectionName,
      Sortby,
      Rank,
      name,
      contractAddress,
      nftName,
    } = query;

    const collections = await this.db.marketplaceCollection.findMany({
      where: {
        OR: [
          {
            name: {
              contains: data,
              mode: "insensitive",
            },
          },

          { contractAddress: data },
        ],
      },
      include: {
        marketplaceFeatured: true,
        marketplaceNft: {
          orderBy: {
            imgTokenId: "asc",
          },
          include: {
            marketplaceAttributes: true,
            marketplaceorder: {
              orderBy: {
                ethPrice: "desc",
              },
            },
            marketplaceAuction: {
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
        marketplaceContract: true,
        marketplaceOffer: true,
      },
    });

    //   return {
    //     data: collections,
    //     totalCollections: collections.length,
    //     message: `All collections  `,
    //     success: true,
    //   };
    // }
    // catch (error) {
    //   return {
    //     data: null,
    //     error: error,
    //     message: error.message,
    //   };
    // }
    // search all collection by default

    if (!collectionId && !collectionName && !Sortby && !Rank && !name) {
      const Collections = await this.db.marketplaceCollection.findMany({
        include: {
          marketplaceContract: true,
          marketplaceFeatured: true,
          marketplaceNft: {
            include: {
              marketplaceAttributes: true,
              marketplaceAuction: true,
              marketplaceOffer: true,
            },
          },
          marketplaceOffer: true,
        },
      });
      return Collections;
    }

    // search rank by nft score
    if (Rank === "true" && collectionId) {
      const rank = await this.db.marketplaceNft.findMany({
        where: {
          marketplaceCollectionId: collectionId,
        },
        orderBy: {
          score: Sortby === "true" ? "asc" : "desc",
        },
        include: {
          marketplaceAttributes: true,
          marketplaceAuction: true,
          marketplaceOffer: true,
        },
      });
      return rank;
    }

    // search collection by id
    if (collectionId) {
      const dataById = await this.db.marketplaceCollection.findUnique({
        where: {
          id: collectionId,
        },
        include: {
          marketplaceFeatured: true,
          marketplaceNft: {
            include: {
              marketplaceAuction: true,
              marketplaceOffer: true,
            },
          },
          marketplaceContract: true,
          marketplaceOffer: true,
        },
      });
      return dataById;
    }

    // search collection by id and nftName
    if (collectionId && nftName) {
      const dataById = await this.db.marketplaceCollection.findUnique({
        where: {
          id: collectionId,
        },
        select: {
          marketplaceFeatured: true,
          marketplaceNft: {
            where: {
              name: nftName,
            },
          },
          marketplaceContract: true,
          marketplaceOffer: true,
        },
      });
      return dataById;
    }
    // search collection by name

    if (collectionName) {
      const databyname = await this.db.marketplaceCollection.findMany({
        where: {
          name: collectionName,
        },
        include: {
          marketplaceContract: true,
          marketplaceFeatured: true,
          marketplaceNft: {
            orderBy: [
              {
                imgTokenId: Sortby ? "asc" : "desc",
              },
            ],
          },
          marketplaceOffer: true,
        },
      });
      return databyname;
    }

    // search rank by nft score
    if (Rank === "true") {
      const rank = await this.db.marketplaceNft.findMany({
        orderBy: {
          score: Sortby === "true" ? "asc" : "desc",
        },
        include: {
          marketplaceAttributes: true,
          marketplaceCollection: true,
        },
      });
      return rank;
    }

    // search collection or nft by name
    if (name) {
      const Collection = await this.db.marketplaceCollection.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        include: {
          marketplaceNft: {
            include: {
              marketplaceAttributes: true,
            },
          },
        },
      });

      const Nft = await this.db.marketplaceNft.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        include: {
          marketplaceCollection: true,
          marketplaceAttributes: true,
        },
      });

      return {
        Collection,
        Nft,
      };
    }

    // search collection by contract address
    if (contractAddress) {
      const Collection = await this.db.marketplaceCollection.findMany({
        where: {
          contractAddress: {
            contains: contractAddress,
            mode: "insensitive",
          },
        },
        include: {
          marketplaceNft: {
            include: {
              marketplaceAttributes: true,
            },
          },
        },
      });

      return Collection;
    }
  }

  async getTrait(query: any) {
    const { collectionId } = query;
    try {
      const collection = await this.db.marketplaceCollection.findUnique({
        where: {
          id: collectionId,
        },
        include: {
          marketplaceNft: {
            include: {
              marketplaceAttributes: true,
            },
          },
        },
      });
      var traits = [];
      for (let nft of collection.marketplaceNft) {
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

      if (!collection) {
        return "not found ";
      }

      return traits;
    } catch (error) {
      console.log("Error", error);
    }
  }
  async marketPlacefilter(query: any) {
    const { contractAddress } = query;
    try {
      // const collection = await this.db.marketplaceCollection.findUnique({
      //   where: {
      //     contractAddress,
      //   },
      //   include: {
      //     marketplaceNft: {
      //       include: {
      //         marketplaceAttributes: true,
      //       },
      //     },
      //   },
      // });
      let collection = await this.db.marketplaceCollection.findUnique({
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

      var traits = [];
      var newcollecion = [];
      for (let nft of collection.marketplaceNft) {
        let finalobj = {};
        finalobj["collectionid"] = nft.marketplaceCollectionId;
        finalobj["nftid"] = nft.id;

        for (let attribute of nft.marketplaceAttributes) {
          let data = traits.find((element) => element == attribute.trait_type);

          finalobj[attribute.trait_type] = attribute.value;
          if (!data) {
            traits.push(attribute.trait_type);
          }
        }
        newcollecion.push(finalobj);
      }

      let newfilter = {};

      var size = Object.keys(query).length;
      for (let trait of traits) {
        for (let i = 1; i <= size; i++) {
          if (trait === Object.keys(query)[i]) {
            newfilter[trait] = Object.values(query)[i];
          }
        }
      }
      const nestedFilter = (targetArray, filters) => {
        var filterKeys = Object.keys(filters);
        return targetArray.filter(function (eachObj) {
          return filterKeys.every(function (eachKey) {
            if (!filters[eachKey].length) {
              return true;
            }
            return filters[eachKey].includes(eachObj[eachKey]);
          });
        });
      };

      let filterData = await nestedFilter(newcollecion, newfilter);
      //return filtereduser;
      var finalArray: any[] = [];
      for (let item of filterData) {
        let nft = await this.db.marketplaceNft.findUnique({
          where: {
            id: item.nftid,
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
        });
        if (nft.marketplaceorder.length > 0) {
          nft["listingType"] = "Listed";
        } else if (nft.marketplaceAuction.length > 0) {
          nft["listingType"] = "Auction";
        } else {
          nft["listingType"] = "Unlisted";
        }
        finalArray.push(nft);
      }
      return {
        data: finalArray,
        message: "Filter data",
        error: null,
      };
    } catch (error) {
      console.log("Error", error);
    }
  }

  async attributeSearch(query: any) {
    const { data, collectionid } = query;
    try {
      const collections = await this.db.marketplaceAttributes.findMany({
        where: {
          value: {
            contains: data,
            mode: "insensitive",
          },
        },

        include: {
          marketplaceNft: {
            include: {
              marketplaceAttributes: true,
              marketplaceorder: {
                orderBy: {
                  ethPrice: "desc",
                },
              },
              marketplaceAuction: {
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

      return {
        data: collections,
        totalCollections: collections.length,
        message: `All collections  `,
        success: true,
      };
    } catch (error) {
      console.log("error", error);
      return {
        data: null,
        error: error,
        message: error.message,
      };
    }
    // search all collection by default

    // if (!collectionId && !collectionName && !Sortby && !Rank && !name) {
    //   const Collections = await this.db.marketplaceCollection.findMany({
    //     include: {
    //       marketplaceContract: true,
    //       marketplaceFeatured: true,
    //       marketplaceNft: {
    //         include: {
    //           marketplaceAttributes: true,
    //           marketplaceAuction: true,
    //           marketplaceBidding: true,
    //           marketplaceOffer: true,
    //         },
    //       },
    //       marketplaceOffer: true,
    //     },
    //   });
    //   return Collections;
    // }

    // // search rank by nft score
    // if (Rank === 'true' && collectionId) {
    //   const rank = await this.db.marketpalceNft.findMany({
    //     where: {
    //       marketplaceCollectionId: collectionId,
    //     },
    //     orderBy: {
    //       score: Sortby === 'true' ? 'asc' : 'desc',
    //     },
    //     include: {
    //       marketplaceAttributes: true,
    //       marketplaceAuction: true,
    //       marketplaceBidding: true,
    //       marketplaceOffer: true,
    //     },
    //   });
    //   return rank;
    // }

    // // search collection by id
    // if (collectionId) {
    //   const dataById = await this.db.marketplaceCollection.findUnique({
    //     where: {
    //       id: collectionId,
    //     },
    //     include: {
    //       marketplaceFeatured: true,
    //       marketplaceNft: {
    //         include: {
    //           marketplaceAuction: true,
    //           marketplaceBidding: true,
    //           marketplaceOffer: true,
    //         },
    //       },
    //       marketplaceContract: true,
    //       marketplaceOffer: true,
    //     },
    //   });
    //   return dataById;
    // }

    // // search collection by id and nftName
    // if (collectionId && nftName) {
    //   const dataById = await this.db.marketplaceCollection.findUnique({
    //     where: {
    //       id: collectionId,
    //     },
    //     select: {
    //       marketplaceFeatured: true,
    //       marketplaceNft: {
    //         where: {
    //           name: nftName,
    //         },
    //       },
    //       marketplaceContract: true,
    //       marketplaceOffer: true,
    //     },
    //   });
    //   return dataById;
    // }
    // // search collection by name

    // if (collectionName) {
    //   const databyname = await this.db.marketplaceCollection.findMany({
    //     where: {
    //       name: collectionName,
    //     },
    //     include: {
    //       marketplaceContract: true,
    //       marketplaceFeatured: true,
    //       marketplaceNft: {
    //         orderBy: [
    //           {
    //             imgTokenId: Sortby ? 'asc' : 'desc',
    //           },
    //         ],
    //       },
    //       marketplaceOffer: true,
    //     },
    //   });
    //   return databyname;
    // }

    // // search rank by nft score
    // if (Rank === 'true') {
    //   const rank = await this.db.marketpalceNft.findMany({
    //     orderBy: {
    //       score: Sortby === 'true' ? 'asc' : 'desc',
    //     },
    //     include: {
    //       marketplaceAttributes: true,
    //       marketplaceCollection: true,
    //     },
    //   });
    //   return rank;
    // }

    // // search collection or nft by name
    // if (name) {
    //   const Collection = await this.db.marketplaceCollection.findMany({
    //     where: {
    //       name: {
    //         contains: name,
    //         mode: 'insensitive',
    //       },
    //     },
    //     include: {
    //       marketplaceNft: {
    //         include: {
    //           marketplaceAttributes: true,
    //         },
    //       },
    //     },
    //   });

    //   const Nft = await this.db.marketpalceNft.findMany({
    //     where: {
    //       name: {
    //         contains: name,
    //         mode: 'insensitive',
    //       },
    //     },
    //     include: {
    //       marketplaceCollection: true,
    //       marketplaceAttributes: true,
    //     },
    //   });

    //   return {
    //     Collection,
    //     Nft,
    //   };
    // }

    // // search collection by contract address
    // if (contractAddress) {
    //   const Collection = await this.db.marketplaceCollection.findMany({
    //     where: {
    //       contractAddress: {
    //         contains: contractAddress,
    //         mode: 'insensitive',
    //       },
    //     },
    //     include: {
    //       marketplaceNft: {
    //         include: {
    //           marketplaceAttributes: true,
    //         },
    //       },
    //     },
    //   });

    //   return Collection;
    // }
  }
}
