const formatSymbol = (symbol: string) => {
  if (symbol?.startsWith("R")) {
    return symbol.charAt(0).toLocaleLowerCase() + symbol.slice(1);
  }

  if (symbol?.startsWith("ST")) {
    if (symbol === "STRD") {
      return symbol;
    }

    return symbol?.substring(0, 2).toLocaleLowerCase() + symbol.slice(2);
  }

  return symbol;
};

export default formatSymbol;
