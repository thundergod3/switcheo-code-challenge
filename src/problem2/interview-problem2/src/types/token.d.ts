type ITokenItem = {
  symbol: string;
  logo: string;
  price?: number;
};

type ICurrencyData = {
  symbol?: string;
  value?: number | string;
  isSwap?: boolean;
};
