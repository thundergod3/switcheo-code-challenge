type ITokenItem = {
  name: string;
  symbol: string;
  logoURI: string;
  price?: number;
};

type ICurrencyData = {
  symbol?: string;
  value?: number | string;
  isSwap?: boolean;
};
