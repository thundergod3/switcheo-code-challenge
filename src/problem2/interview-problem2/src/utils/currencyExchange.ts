export const exchangeCurrencyToDollar = (
  data: ITokenItem[],
  amount: number,
  fromCurrency: string
): number => {
  const selectedCurrency = data.find(
    (cur) => cur.symbol.toLowerCase() === fromCurrency.toLowerCase()
  );

  const exchangedAmount = (selectedCurrency?.price ?? 0) * amount;

  return exchangedAmount;
};
