export const convertPayToReceive = (
  data: ITokenItem[],
  from: ICurrencyData,
  to: ICurrencyData
): number | null => {
  const { symbol: fromCurrency, value: fromAmount } = from;
  const { symbol: toCurrency } = to;

  const fromCurrencyData = data.find(
    (cur) => cur.symbol.toLowerCase() === fromCurrency?.toLowerCase()
  );

  const toCurrencyData = data?.find(
    (cur) => cur.symbol.toLowerCase() === toCurrency?.toLowerCase()
  );

  const payAmountForEachDollar = 1 / (fromCurrencyData?.price ?? 1);
  const receiveAmountForEachDollar = 1 / (toCurrencyData?.price ?? 1);

  if (!toCurrency || !fromCurrency) {
    return null;
  }

  return (
    (Number(fromAmount) * receiveAmountForEachDollar) / payAmountForEachDollar
  );
};

export const convertReceiveToPay = (
  data: ITokenItem[],
  from: ICurrencyData,
  to: ICurrencyData
): number | null => {
  const { symbol: fromCurrency, value: fromAmount } = from;
  const { symbol: toCurrency } = to;

  const fromCurrencyData = data.find(
    (cur) => cur.symbol.toLowerCase() === fromCurrency?.toLowerCase()
  );

  const toCurrencyData = data.find(
    (cur) => cur.symbol.toLowerCase() === toCurrency?.toLowerCase()
  );

  const payAmountForEachDollar = 1 / (fromCurrencyData?.price ?? 1);
  const receiveAmountForEachDollar = 1 / (toCurrencyData?.price ?? 1);

  if (!toCurrency || !fromCurrency) {
    return null;
  }

  return (
    (Number(fromAmount) / payAmountForEachDollar) * receiveAmountForEachDollar
  );
};
