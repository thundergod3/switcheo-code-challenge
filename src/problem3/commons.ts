import { Blockchain } from "./types";

// FIXME: Bring this function away from WalletPage
// FIXME: Change any type
export const getPriority = (blockchain?: Blockchain): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};
