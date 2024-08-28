import { Icon } from "@iconify/react";
import { Flex } from "@radix-ui/themes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import cx from "classnames";
import { toast } from "react-toastify";

import { PRICES_API } from "src/constants/endpoints";
import { exchangeCurrencyToDollar } from "src/utils/currencyExchange";
import {
  convertPayToReceive,
  convertReceiveToPay,
} from "src/utils/currencyConvert";
import { CurrencyInputTypes } from "src/types/enums";
import { LOGO_TOKEN_IMAGE_URL } from "src/constants/values";

import SwapCurrencyInput from "src/components/astom/SwapCurrencyInput";
import SelectTokenModal from "../SelectTokenModal";
import ConfirmDialog from "src/components/astom/ConfirmDialog";
import formatSymbol from "src/utils/formatSymbol";
import { Button } from "src/components/astom/Button";

const SwapCurrencyForm = () => {
  const [openSelectTokenModal, setOpenSelectTokenModal] = useState(false);
  const [tokensData, setTokensData] = useState<ITokenItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [currentSymbol, setCurrentSymbol] = useState("");
  const [currentType, setCurrentType] = useState<CurrencyInputTypes | string>(
    ""
  );
  const [isError, setIsError] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [inData, setInData] = useState<ICurrencyData>({});
  const [outData, setOutData] = useState<ICurrencyData>({});
  const [isTriggerResetKey, setIsTriggerResetKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConnectWallet, setIsConnectWallet] = useState(false);

  const isDisabled = useMemo(
    () => !inData?.value || !outData?.value,
    [inData?.value, outData?.value]
  );
  const isDisabledWithSymbol = useMemo(
    () => !inData?.symbol || !outData?.symbol,
    [inData?.symbol, outData?.symbol]
  );

  const handleOpenSelectTokenModal = useCallback(
    (symbol: string, type?: CurrencyInputTypes) => {
      if (type) {
        setCurrentType(type);
      }

      setOpenSelectTokenModal(true);
      setCurrentSymbol(symbol);
    },
    []
  );

  const formatCurrencyProps = useCallback(
    (data: ICurrencyData) => {
      if (!data?.symbol) {
        return;
      }

      const findToken = tokensData?.find(
        (record) => record?.symbol === data?.symbol
      );

      return {
        isToken: !!findToken,
        text: findToken?.symbol || "Select token",
        tokenImage: findToken?.logo,
        dollarValue: exchangeCurrencyToDollar(
          tokensData,
          Number(data?.value),
          data?.symbol
        ),
      };
    },
    [tokensData]
  );

  const formatInAndOutData = useCallback(
    (
      inCurrencyData: ICurrencyData,
      outCurrencyData: ICurrencyData,
      value: number,
      type: string
    ) => {
      const formatInData = {
        ...inCurrencyData,
      };
      const formatOutData = {
        ...outCurrencyData,
      };

      if (type === "in") {
        formatInData.value = value;
        formatOutData.value = convertPayToReceive(
          tokensData,
          formatInData,
          formatOutData
        )?.toString();
      } else {
        formatOutData.value = value;
        formatInData.value = convertReceiveToPay(
          tokensData,
          formatOutData,
          formatInData
        )?.toString();
      }

      return [formatInData, formatOutData];
    },
    [tokensData]
  );

  const handleSelectToken = useCallback(
    (symbol: string) => {
      const isSymbolInData = inData?.symbol === symbol;
      const isSymbolOutData = outData?.symbol === symbol;

      setCurrentSymbol(symbol);
      setOpenSelectTokenModal(false);
      setIsError(false);

      const isInCurrency = currentType === CurrencyInputTypes.in;
      const inDataWithNewSymbol = {
        ...inData,
        symbol,
      };
      let newInData: ICurrencyData = {};
      let newOutData: ICurrencyData = {};
      let formatInData;
      let formatOutData;

      if (isInCurrency) {
        formatInData = convertReceiveToPay(
          tokensData,
          outData,
          inDataWithNewSymbol
        );
        newInData = {
          ...inData,
          symbol,
          value: inData?.value || formatInData?.toString(),
        };

        if (outData?.value) {
          formatOutData = convertPayToReceive(
            tokensData,
            inDataWithNewSymbol,
            outData
          );
          newOutData = {
            ...outData,
            value: formatOutData?.toString(),
          };
        }
      } else {
        formatOutData = convertPayToReceive(tokensData, inData, {
          ...outData,
          symbol,
        });
        newOutData = {
          ...outData,
          symbol,
          value: outData?.value || formatOutData?.toString(),
        };
        newInData = inData;
      }

      if (isSymbolOutData) {
        newInData.symbol = symbol;

        if (!inData?.symbol) {
          newOutData.symbol = undefined;
        } else {
          newOutData.symbol = inData?.symbol;
        }
      }

      if (isSymbolInData) {
        newOutData.symbol = symbol;

        if (!outData?.symbol) {
          newInData.symbol = undefined;
        } else {
          newInData.symbol = outData?.symbol;
        }
      }

      setInData(newInData);
      setOutData(newOutData);
    },
    [currentType, inData, outData, tokensData]
  );

  const handleSwapCurrency = useCallback(() => {
    if (isDisabledWithSymbol) {
      return;
    }

    const [formatInData, formatOutData] = formatInAndOutData(
      outData,
      inData,
      inData?.value as number,
      currentType
    );

    setInData(formatInData);
    setOutData(formatOutData);
  }, [currentType, formatInAndOutData, inData, isDisabledWithSymbol, outData]);

  const handleCurrencyChange = useCallback(
    (value: number, type: string) => {
      setIsError(false);

      const [formatInData, formatOutData] = formatInAndOutData(
        inData,
        outData,
        value,
        type
      );

      setInData(formatInData);
      setOutData(formatOutData);
    },
    [formatInAndOutData, inData, outData]
  );

  const handleSubmitSwapCurrency = useCallback(() => {
    if (isDisabled) {
      setIsError(true);

      return;
    }

    setOpenConfirmDialog(true);
  }, [isDisabled]);

  const triggerResetFormWithKey = useCallback(() => {
    setIsTriggerResetKey(true);

    setTimeout(() => setIsTriggerResetKey(false), 1);
  }, []);

  const handleConfirmSwapCurrency = useCallback(() => {
    setInData({
      symbol: inData?.symbol,
    });
    setOutData({
      symbol: outData?.symbol,
    });
    toast.success(
      `You have transfer from token ${inData?.symbol} to ${outData?.symbol}`
    );
    triggerResetFormWithKey();
  }, [inData?.symbol, outData?.symbol, triggerResetFormWithKey]);

  const handleCancel = useCallback(() => {
    setOpenConfirmDialog(false);
  }, []);

  const handleGetTokensPrice = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(PRICES_API);
      const data = await response.json();

      const formatData: ITokenItem[] = [];

      data?.forEach((record: any) => {
        const findData = formatData?.find(
          (token: any) => token?.symbol === record?.currency
        );
        const symbol = formatSymbol(record?.currency);

        if (!findData) {
          formatData.push({
            symbol: symbol,
            price: record?.price,
            logo: `${LOGO_TOKEN_IMAGE_URL}/${symbol}.svg`,
          });
        }
      });

      setLoading(false);
      setTokensData(formatData);
      setInData({
        ...inData,
        symbol: formatData?.[0]?.symbol,
      });
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  }, [inData]);

  const handleConnectWallet = useCallback(() => {
    const resolveAfter3Sec = new Promise((resolve) =>
      setTimeout(() => {
        setIsConnectWallet(true);
        resolve(true);
      }, 3000)
    );

    toast.promise(resolveAfter3Sec, {
      pending: "Wallet connect is processing ( Simulate ",
      success: "Wallet connect success",
      error: "Wallet connect failed",
    });
  }, []);

  const renderButtonLayout = useCallback(() => {
    if (isConnectWallet) {
      return (
        <Button
          className={cx("!h-14", {
            "!bg-primary-grey": isError,
          })}
          onClick={handleSubmitSwapCurrency}
          disabled={isError || loading}>
          Swap
        </Button>
      );
    }

    return (
      <Button variant="outline" className="!h-14" onClick={handleConnectWallet}>
        Connect Wallet
      </Button>
    );
  }, [
    handleConnectWallet,
    handleSubmitSwapCurrency,
    isConnectWallet,
    isError,
    loading,
  ]);

  useEffect(() => {
    handleGetTokensPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Flex justify="center" align="center" className="w-screen h-screen">
        <div className="rounded-3xl swap-currency-form w-full lg:w-fit lg:min-w-[560px] px-4 lg:px-0">
          <Flex
            gap="2"
            direction="column"
            className="bg-secondary-black p-6 rounded-3xl">
            <SwapCurrencyInput
              label="You pay"
              {...formatCurrencyProps(inData)}
              onSelectToken={handleOpenSelectTokenModal}
              type={CurrencyInputTypes.in}
              value={inData?.value as number}
              onValueChange={handleCurrencyChange}
              isError={isError}
              currencyErrorMessage="You must input the value you want to pay"
              key={`${isTriggerResetKey}-in`}
              placeholder="Select token"
            />
            <Flex
              justify="center"
              align="center"
              className={cx(
                "relative w-10 h-10 bg-primary-black border-secondary-black rounded-xl border-4 -my-[26px] mx-auto cursor-pointer",
                {
                  "cursor-not-allowed": isDisabled,
                }
              )}
              onClick={handleSwapCurrency}>
              <Icon
                icon="tabler:arrow-down"
                className={cx("text-white", {
                  "opacity-50 cursor-not-allowed": isDisabledWithSymbol,
                })}
              />
            </Flex>
            <SwapCurrencyInput
              label="You receive"
              {...formatCurrencyProps(outData)}
              onSelectToken={handleOpenSelectTokenModal}
              type={CurrencyInputTypes.out}
              value={outData?.value as number}
              onValueChange={handleCurrencyChange}
              isError={isError}
              currencyErrorMessage="You must input the value you want to receive"
              tokenErrorMessage="You must select a token"
              key={`${isTriggerResetKey}-out`}
              placeholder="Select token"
              disabled={!outData?.symbol}
            />
            {renderButtonLayout()}
          </Flex>
        </div>
      </Flex>
      <SelectTokenModal
        keyword={keyword}
        title="Select a token"
        placeholder="Search name"
        open={openSelectTokenModal}
        onOpenChange={setOpenSelectTokenModal}
        tokensData={tokensData}
        onSearchChange={setKeyword}
        value={currentSymbol}
        onSelectToken={handleSelectToken}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        onOpenChange={setOpenConfirmDialog}
        onCancel={handleCancel}
        onConfirm={handleConfirmSwapCurrency}
        title={`Confirm swap from token ${inData?.symbol} to ${outData?.symbol}`}
        content="Are you confirming to swap this token?"
      />
    </>
  );
};

export default SwapCurrencyForm;
