const calculateCurrency = (
  inPrice: number,
  outPrice: number,
  tokenTransfer: number | string,
  type = "in"
) => {
  const rateFromInToOut = Number(inPrice) / Number(outPrice);

  if (type === "in") {
    return Number((Number(tokenTransfer) * rateFromInToOut).toFixed(5)) || "";
  } else {
    return Number((Number(tokenTransfer) / rateFromInToOut).toFixed(5)) || "";
  }
};

export default calculateCurrency;
