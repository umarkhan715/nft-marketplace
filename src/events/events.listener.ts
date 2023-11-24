import abi from "./abi.json";

const Web3 = require("web3");
const CONTRACT_ADDRESS = "0xD14b3b4696DBA2d25763b45637D415dE70818f18";
import { EventsService } from "./events.service";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const events = new EventsService(db);

export async function listen() {
  console.log("Event  is Listrning");
  let web3 = new Web3(
    "wss://goerli.infura.io/ws/v3/149d830b73a14cd59da16a65c93806b8"
  );

  const ct = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

  // ct.getPastEvents(
  //   "allEvents",
  //   {
  //     fromBlock: 0,
  //     toBlock: "latest",
  //   },
  //   (error, events) => {
  //     console.log(events);
  //   }
  // );
  // console.log("ALL methods", ct.methods);
  // console.log(await ct.methods.marketOwner().call());

  ct.events.buyOrderSuccessfull((error, event) => {
    console.log(event);

    // console.log(OrderCreatedEvent);
    // events.handleOrderCreatedEvent(OrderCreatedEvent).then((response) => {
    //   console.log('Response', response);
    // });
  });

  ct.events.buyOrderCancel((error, event) => {
    console.log(event);
  });

  ct.events.offerAccepted((error, event) => {
    console.log(event);
  });

  ct.events.offerCancel((error, event) => {
    console.log(event);
  });
  ct.events.bidAccepted((error, event) => {
    console.log(event);
  });

  ct.events.auctionCancel((error, event) => {
    console.log(event);
  });
}
