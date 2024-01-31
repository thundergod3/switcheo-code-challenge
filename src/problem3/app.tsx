import classes from "./styles.scss";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: any;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  private readonly endpoint: string;

  constructor(url: string) {
    // @ts-ignore
    this.endpoint = url;
  }

  async getPrices() {
    try {
      const response = await fetch(this.endpoint);
      const data = await response.json();

      const prices = {};

      data?.forEach((record: any) => {
        prices[record?.currency] = record?.price;
      });

      return prices;
    } catch (error) {
      return error;
    }
  }
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const [prices, setPrices] = useState({});

  const handleGetDataSources = useCallback(() => {
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );
    datasource
      .getPrices()
      .then((data) => {
        setPrices(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getPriority = useCallback((blockchain: any): number => {
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
  }, []);

  const checkBalancePriority = useCallback(
    (balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);

      if (balancePriority > -99 && balance.amount <= 0) {
        return true;
      }

      return false;
    },
    [getPriority]
  );

  const sortPriority = useCallback(
    (lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);

      if (leftPriority > rightPriority) {
        return -1;
      }

      return 1;
    },
    [getPriority]
  );

  const sortedBalances = useMemo(() => {
    return balances.filter(checkBalancePriority).sort(sortPriority);
  }, [checkBalancePriority, sortPriority]);

  const rows = useCallback(() => {
    return sortedBalances.map(
      (balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;

        return (
          <WalletRow
            className={classes.row}
            key={`row-${index}`}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      }
    );
  }, [prices]);

  useEffect(() => {
    handleGetDataSources();
  }, []);

  return <div {...rest}>{rows}</div>;
};
