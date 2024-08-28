import classes from "./styles.scss";
import { BaseCurrency, WalletBalance, FormattedWalletBalance } from "./commons";
import { getPriority } from "./types";

// FIXME: Add data source
class Datasource {
  dataSourceUrl: string;

  constructor(url: string) {
    this.dataSourceUrl = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    const data = await fetch(this.dataSourceUrl);

    const rawData: BaseCurrency[] = await data.json();

    const prices: Record<string, number> = rawData.reduce((acc, item) => {
      const { currency, price } = item;

      return {
        ...acc,
        [currency]: price,
      };
    }, {});

    return prices;
  }
}

interface Props extends BoxProps {} // FIXME: Miss interface for BoxProps

// FIXME: children prop is redundant
export const WalletPage: React.FC<Props> = (props: Props) => {
  const [prices, setPrices] = useState<Record<string, number>>(); // FIXME: Add type for prices

  const balances: WalletBalance[] = useWalletBalances(); // FIXME: Add type for balances

  const sortedBalances = useMemo(() => {
    return balances
      .filter(
        (balance: WalletBalance) =>
          balance.amount >= 0 && getPriority(balance.blockchain) > -99
      )
      .sort(
        (lhs: WalletBalance, rhs: WalletBalance) =>
          getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
      );
  }, [balances]); // FIXME: Redundant dependency prices

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
    (balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    }
  );

  // FIXME: Memoize this values
  const rows = useMemo(
    () =>
      // FIXME: use formattedBalances instead of sortedBalances
      formattedBalances.map((balance: FormattedWalletBalance) => {
        const usdValue = (prices?.[balance.currency] ?? 0) * balance.amount; // FIXME:  Provide fallback value once prices is undefined

        return (
          <WalletRow
            className={classes.row}
            key={balance.currency} // FIXME: Do not use index for key
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      }),
    []
  );

  useEffect(() => {
    const datasource = new Datasource(
      "https://interview.switcheo.com/prices.json"
    );

    datasource
      .getPrices()
      .then((prices) => {
        setPrices(prices);
      })
      .catch((error) => {
        console.error(error); // FIXME: console.error
      });
  }, []);

  return <div {...props}>{rows}</div>;
};
