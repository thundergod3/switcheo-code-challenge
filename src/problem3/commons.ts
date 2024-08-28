export type Blockchain =
  | "Osmosis"
  | "Ethereum"
  | "Arbitrum"
  | "Zilliqa"
  | "Neo";

export interface BaseCurrency {
  currency: string;
  date: string;
  price: number;
}

export interface WalletBalance {
  currency: string;
  amount: number;
  blockchain?: Blockchain; // FIXME: Add blockchain type
}
export interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
