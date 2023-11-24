import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const calendaData = require("../calendardata.json");

const prisma = new PrismaClient();
const config = new ConfigService();
const rinkbey = require("../metadata/rinkby.json");
async function main() {
  /// Creating ROLES
  // await prisma.role.createMany({
  //   data: [{ name: "Moderator" }, { name: "Admin" }, { name: "User" }],
  //   skipDuplicates: true, // Skip 'Bobo'
  // });

  const user = await prisma.user.create({
    data: {
      profileImage: config.get("profileImage"),
      coverImage: config.get("bannerImage"),
      username: "User",
      discordlink: "",
      twitterlink: "",
      spendingAmount: 0,
      wallets: {
        create: {
          walletAddress: "0x9890fE1Ae73E0D73DDA8643edeCFe9e18023bF0e",
          WalletType: {
            create: {
              walletType: "Ethereum",
            },
          },
        },
      },
    },
  });

  console.log("User", user);
  let adminRole = await prisma.role.findUnique({
    where: {
      name: "Admin",
    },
  });
  let modRole = await prisma.role.findUnique({
    where: {
      name: "Moderator",
    },
  });
  const hash = bcrypt.hashSync("123456789", 5);
  await prisma.credentails.create({
    data: {
      email: "admin@ncutechnologies.com",
      password: hash,
      phoneNumber: "123",
      roleId: adminRole.id,
    },
  });

  let moderator = await prisma.credentails.create({
    data: {
      email: "moderator@ncutechnologies.com",
      password: hash,
      phoneNumber: "123",
      roleId: modRole.id,
    },
  });

  /// Creating wallet types
  await prisma.walletType.createMany({
    data: [
      { walletType: "Solana" },
      { walletType: "Tokamak" },
      { walletType: "Polygon" },
      { walletType: "Cardano" },
      { walletType: "Aptos" },
      { walletType: "Binance Smart Chain" },
      { walletType: "WAX" },
      { walletType: "Cronos" },
      { walletType: "NEAR" },
      { walletType: "Hedera" },
      { walletType: "Moonriver" },
      { walletType: "Algorand" },
      { walletType: "TRON" },
    ],
    // skipDuplicates: true, // Skip 'Bobo'
  });

  await prisma.blockchainType.createMany({
    data: [
      {
        blockChainName: "Ethereum",
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/qgwQs44Hym0ILiSR6Sxs54spiHFttRAdyop8UQkJ.webp",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/5pwLOdvD20vEa20UMDyISyJtaUjAOwnPr5r1cqzc.webp",
        blockChainName: "Solana",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/QQ6bMcuhTk9aF7nvncALz7JkRbZJdulw7lfNSSaW.webp",
        blockChainName: "Polygon",
      },
      {
        blockChainIcon:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVDGsOoeTP0DRG199jaTe_oQRjBK2MtnpiTaLb3wILdQ&s",
        blockChainName: "Tokamak",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/QQ6bMcuhTk9aF7nvncALz7JkRbZJdulw7lfNSSaW.webp",
        blockChainName: "Polygon",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/5d55durHg7xEy9fFfma18G4djQKJ3SusHKmK7KLT.webp",
        blockChainName: "Cardano",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/1fKcDBvaroEVnwnxLCjygjZ9zmiLnqSALr9MN5Nd.png",
        blockChainName: "Aptos",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/XZK9VMrQWIVQ0xpzvJbnjEI3ujoXXQhNVY8Z1TqC.webp",
        blockChainName: "Binance Smart Chain",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/Efedz6bZX2chZqFfMAUtpw5bUg84QV6wODb3g82W.webp",
        blockChainName: "WAX",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/WkushDlBkdl9hD1heZiTtLBvrVbLJyYpCRuRDwWu.png",
        blockChainName: "Cronos",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/CyjuJo5hCbUzXrR4N3o7kWmgLwHtg4PWDaMdfAxJ.png",
        blockChainName: "NEAR",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/FifN2XQwFMOLnkrmx2VQd7lF3h5fw9bx2cRvTlyH.png",
        blockChainName: "Hedera",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/YMdMrpg5YeFlNlystrRd4p8UPV5QMGV2zdA1SV2w.jpg",
        blockChainName: "Moonriver",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/tNWlaC5OffbaOiykwcFFWTsJUG8F7XmRf4Vk9Xwk.jpg",
        blockChainName: "Algorand",
      },
      {
        blockChainIcon:
          "https://nftcalendar.io/storage/uploads/blockchains/icons/dYj5auTLjROWWSIJdZ7iP9qeZQALb0gqGAcSFbLJ.png",
        blockChainName: "TRON",
      },
    ],
    // skipDuplicates: true, // Skip 'Bobo'
  });

  let BlockChainList = await prisma.blockchainType.findMany({
    select: {
      id: true,
    },
  });

  let featuredList = [true, false];

  for (let index = 0; index < calendaData.length; index++) {
    const PresaleDate = new Date(
      new Date("2023-01-01").getTime() +
      Math.random() *
      (new Date("2023-03-01").getTime() - new Date("2023-01-01").getTime())
    );

    const PresaleEndDate = new Date(
      new Date("2023-03-01").getTime() +
      Math.random() *
      (new Date("2023-06-01").getTime() - new Date("2023-03-01").getTime())
    );

    const PublicSaleDate = new Date(
      new Date("2023-06-01").getTime() +
      Math.random() *
      (new Date("2023-09-01").getTime() - new Date("2023-06-01").getTime())
    );

    const PublicSaleEndDate = new Date(
      new Date("2023-09-01").getTime() +
      Math.random() *
      (new Date("2023-12-01").getTime() - new Date("2023-09-01").getTime())
    );

    const randomIndex = Math.floor(Math.random() * BlockChainList.length);
    const randomFeatureIndex = Math.floor(Math.random() * featuredList.length);
    const blockchainTypeId = BlockChainList[randomIndex].id;
    await prisma.calendar.create({
      data: {
        title: calendaData[index].title,
        description: calendaData[index].description,
        profileImage: calendaData[index].profileImage,
        bannerImage: calendaData[index].bannerImage,
        calendarGif: calendaData[index].calendarGif,
        featured: featuredList[randomFeatureIndex],
        blockchainTypeId: blockchainTypeId,
        launchDate: PresaleDate.toISOString(),
        status: calendaData[index].status,
        category: calendaData[index].category,
        userId: user.id,
        saletype: {
          create: [
            {
              price: 12,
              type: "preSale",
              starttime: PresaleDate.toISOString(),
              endTime: PresaleEndDate.toISOString(),
            },
            {
              price: 20,
              type: "publicSale",
              starttime: PublicSaleDate.toISOString(),
              endTime: PublicSaleEndDate.toISOString(),
            },
          ],
        },
        socialLinks: {
          create: {
            website: "https://ncutechnologies.com/",
            discord: "https://discord.com/",
            twitter: "https://twitter.com/",
            etherscan: "https://www.quicknode.com/login",
          },
        },
        faq: {
          create: [
            {
              question: "The ultimate guide to NFT?",
              answer:
                "We found these 125 questions asked by various individuals in all sorts of places that we discovered during our research. Of course, some might carry more weight than others, and some of them might not be relevant to many, but we still wanted to cover all of these aspects. If you don’t care for one particular aspect, please feel free to simply scroll forward in the article to the bits you want to know more about from the world of NFT.",
            },
            {
              question: "What does NFT mean?",
              answer:
                "NFTs (non-fungible tokens) are digital assets that are unique and cannot be replicated. They are different from traditional cryptocurrencies like Bitcoin because they represent a specific unit of ownership rather than acting as a general medium of exchange.",
            },
            {
              question: "What is NFT used for?",
              answer:
                "NFTs can be used for a variety of purposes, such as representing ownership of digital assets like artwork, video games, and even virtual real estate. They can also be used to represent physical assets like tickets, loyalty points, and memberships.",
            },
            {
              question:
                "What is the difference between NFTs and cryptocurrency?",
              answer:
                "NFTs are unique and cannot be replicated, while traditional cryptocurrencies like Bitcoin can be replicated. NFTs represents a specific unit of ownership, while cryptocurrencies act as a general medium of exchange.",
            },
            {
              question: "What are the benefits of NFTs?",
              answer:
                "Some benefits of NFTs include that they can be used to represent ownership of digital assets, they are more secure than traditional methods like PayPal and credit cards, and they can be traded 24/seven.",
            },
            {
              question: "What are the risks of NFTs?",
              answer:
                "Some risks associated with NFTs include that they are subject to volatility and scams and that they may not be compatible with all wallets and exchanges.",
            },
          ],
        },
        roadMap: {
          create: [
            {
              title: calendaData[10].title,
              description: calendaData[12].description,
            },
            {
              title: calendaData[13].title,
              description: calendaData[14].description,
            },
            {
              title: calendaData[15].title,
              description: calendaData[16].description,
            },
          ],
        },
        tags: {
          create: [
            {
              name: "blockChain",
            },
            {
              name: "NFT",
            },
            ,
            {
              name: "MetaVerse",
            },
            ,
            {
              name: "SmartContract",
            },
          ],
        },
        team: {
          create: [
            {
              name: "John Smith",
              role: "Developer",
              profileImage:
                "https://www.google.com/imgres?imgurl=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F002%2F002%2F403%2Foriginal%2Fman-with-beard-avatar-character-isolated-icon-free-vector.jpg&imgrefurl=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-avatar&tbnid=MV9dWdy0ZY_UPM&vet=12ahUKEwisgZXJrqb9AhWGmicCHQv-DN8QMygAegUIARDmAQ..i&docid=j1o201ERqM1BVM&w=7973&h=7974&q=profile%20picture%20avatar&ved=2ahUKEwisgZXJrqb9AhWGmicCHQv-DN8QMygAegUIARDmAQ",
              description: "Frontend developer",
              twitter: "https://twitter.com/",
              discordLink: "https://discord.com/",
              LinkedIn: "https://linkedin.com/",
            },
            {
              name: "Ibrar Gill",
              role: "Developer",
              profileImage:
                "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.freepik.com%2Fpremium-vector%2Fman-avatar-profile-round-icon_24640-14044.jpg%3Fw%3D2000&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Fpremium-vector%2Fman-avatar-profile-round-icon_2651713.htm&tbnid=28H_MlJKYZIWKM&vet=12ahUKEwisgZXJrqb9AhWGmicCHQv-DN8QMygHegUIARD4AQ..i&docid=Zzuhwp4jprv_YM&w=2000&h=2000&q=profile%20picture%20avatar&ved=2ahUKEwisgZXJrqb9AhWGmicCHQv-DN8QMygHegUIARD4AQ",
              description: "Backend Developer",
              twitter: "https://twitter.com/",
              discordLink: "https://discord.com/",
              LinkedIn: "https://linkedin.com/",
            },
            {
              name: "John Smith 2",
              role: "Developer",
              description: "QA",
              profileImage:
                "https://www.google.com/imgres?imgurl=https%3A%2F%2Fc8.alamy.com%2Fcomp%2FTC2FPE%2Fyoung-man-avatar-cartoon-character-profile-picture-TC2FPE.jpg&imgrefurl=https%3A%2F%2Fwww.alamy.com%2Fyoung-man-avatar-cartoon-character-profile-picture-image248377318.html&tbnid=8_XPUJTkragE6M&vet=12ahUKEwisgZXJrqb9AhWGmicCHQv-DN8QMygSegUIARCQAg..i&docid=ALQX6WHVd2EA6M&w=1125&h=1390&q=profile%20picture%20avatar&ved=2ahUKEwisgZXJrqb9AhWGmicCHQv-DN8QMygSegUIARCQAg",
              twitter: "https://twitter.com/",
              discordLink: "https://discord.com/",
              LinkedIn: "https://linkedin.com/",
            },
          ],
        },
      },
    });
  }

  let controlsArr = [
    { route: "/admin/analytics", title: "Analytics" },
    { route: "/admin/payout", title: "Payout" },
    { route: "/admin/projects", title: "Projects" },
    { route: "/admin/reports", title: "Reports" },
    { route: "/admin", title: "Dashboard" },
    { route: "/admin/rarity", title: "Rarity" },
    { route: "/admin/role", title: "Role" },
    { route: "/admin/moderators", title: "Moderators" },
    { route: "/admin/collections", title: "Collections" },
    { route: "/admin/nft-calendar", title: "Calendar" },
    { route: "/admin/users", title: "User Profiles" },
    { route: "/admin/marketplace", title: "Marketplace" },
    { route: "/admin/settings", title: "Settings" },
  ];
  for (let index = 0; index < controlsArr.length; index++) {
    let title = controlsArr[index].title;
    let route = controlsArr[index].route;
    let controlAdded = await prisma.controls.create({
      data: {
        title: title,
        route: route,
      },
    });
    if (title === "Rarity" || title === "Marketplace")
      await prisma.permissions.create({
        data: {
          title: controlAdded.title,
          controlId: controlAdded.id,
          moderatorId: moderator.id,
        },
      });
  }

  // launchPad
  let launchpadProject = await prisma.launchPadProject.create({
    data: {
      name: "rinksy",
      description: "rinksy description",
      blockchainTypeId: BlockChainList[0].id,
      nftquantity: 10000,
      walletAddress: "0x92f18470e346A943B2240c51F851329ab7918cd8",
      type: "single",
      twitterLink: "http://twitterLink.com",
      discordLink: "http://twitterLink.com",
      profileImage:
        "https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s0",
      bannerImage:
        "https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s0",
      userId: user.id,
    },
  });
  /// Creating Tushi Collection with NFTS and Attributes
  let createdCollection = null;
  createdCollection = await prisma.marketplaceCollection.create({
    data: {
      name: "defaultCollections",
      projectType: "etherum",
      description: "default Value",
      quantity: 99,
      contractAddress: "0xEA3D9224f6d15AC1f5476dd6fa53017E59475058",
      UserId: user.id,
      isActive: true,
      Royalty: 90,
      bannerImage:
        "https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs?auto=format&w=3840",
      ProfileImage:
        "https://lh3.googleusercontent.com/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB=s0",
    },
  });
  let createdNFT = null;

  for (let i = 0; i < 49; i++) {
    createdNFT = await prisma.marketplaceNft.create({
      data: {
        marketplaceCollectionId: createdCollection.id,
        img: rinkbey[i].image,
        description: "default Value",
        name: rinkbey[i].name,
        score: rinkbey[i].nftScore,
        imgTokenId: i + 1,
        launchpadProjectId: launchpadProject.id,
      },
    });

    console.log("User", user);
    for (let j = 0; j < rinkbey[i].attributes.length; j++) {
      await prisma.marketplaceAttributes.create({
        data: {
          trait_type: rinkbey[i].attributes[j].trait_type,
          value: rinkbey[i].attributes[j].value,
          marketplaceNftId: createdNFT.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
