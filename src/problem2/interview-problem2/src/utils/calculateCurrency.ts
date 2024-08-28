const calculateCurrency = (
  inPrice = 0,
  outPrice = 0,
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
