import { Icon } from "@iconify/react";
import { Button, Flex } from "@radix-ui/themes";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import cx from "classnames";
import { toast } from "react-toastify";

import calculateCurrency from "src/utils/calculateCurrency";

import SwapCurrencyInput from "src/components/astom/SwapCurrencyInput";
import SelectTokenModal from "../SelectTokenModal";
import ConfirmDialog from "src/components/astom/ConfirmDialog";
import formatSymbol from "src/utils/formatSymbol";

const SwapCurrencyForm = () => {
  const [openSelectTokenModal, setOpenSelectTokenModal] = useState(false);
  const [tokensData, setTokensData] = useState<ITokenItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [currentSymbol, setCurrentSymbol] = useState("");
  const [currentType, setCurrentType] = useState("");
  const [isError, setIsError] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [inData, setInData] = useState<ICurrencyData>({});
  const [outData, setOutData] = useState<ICurrencyData>({});
  const [isTriggerResetKey, setIsTriggerResetKey] = useState(false);

  const isDisabled = useMemo(
    () => !inData?.value || !outData?.value,
    [inData?.value, outData?.value]
  );

  const handleOpenSelectTokenModal = useCallback(
    (symbol: string, type: string) => {
      setOpenSelectTokenModal(true);
      setCurrentType(type);
      setCurrentSymbol(symbol);
    },
    []
  );

  const formatCurrencyProps = useCallback(
    (symbol?: string) => {
      const findToken = tokensData?.find((record) => record?.symbol === symbol);

      return {
        isToken: !!findToken,
        text: findToken?.symbol || "Select token",
        tokenImage: findToken?.logo,
        dollarValue: findToken?.price,
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
        formatOutData.value = calculateCurrency(
          formatCurrencyProps(formatInData?.symbol)?.dollarValue || 0,
          formatCurrencyProps(formatOutData?.symbol)?.dollarValue || 0,
          value
        );
      } else {
        formatOutData.value = value;
        formatInData.value = calculateCurrency(
          formatCurrencyProps(formatInData?.symbol)?.dollarValue || 0,
          formatCurrencyProps(formatOutData?.symbol)?.dollarValue || 0,
          value,
          "out"
        );
      }

      return [formatInData, formatOutData];
    },
    [formatCurrencyProps]
  );

  const handleSelectToken = useCallback(
    (symbol: string) => {
      setCurrentSymbol(symbol);
      setOpenSelectTokenModal(false);

      const isInCurrency = currentType === "in";

      const [formatInData, formatOutData] = formatInAndOutData(
        isInCurrency
          ? {
              ...inData,
              symbol,
            }
          : inData,
        isInCurrency
          ? outData
          : {
              ...outData,
              symbol,
            },
        (currentType === "in" ? inData?.value : outData?.value) as number,
        currentType
      );

      setInData(formatInData);
      setOutData(formatOutData);
    },
    [currentType, formatInAndOutData, inData, outData]
  );

  const handleSwapCurrency = useCallback(() => {
    const [formatInData, formatOutData] = formatInAndOutData(
      outData,
      inData,
      inData?.value as number,
      currentType
    );

    setInData(formatInData);
    setOutData(formatOutData);
  }, [currentType, formatInAndOutData, inData, outData]);

  const handleCurrencyChange = useCallback(
    (value: number, type: string) => {
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
      symbol: tokensData?.[0]?.symbol,
    });
    setOutData({});
    toast.success(
      `You have from token ${inData?.symbol} to ${outData?.symbol}`
    );
    triggerResetFormWithKey();
  }, [inData?.symbol, outData?.symbol, tokensData, triggerResetFormWithKey]);

  const handleCancel = useCallback(() => {
    setOpenConfirmDialog(false);
  }, []);

  const handleGetTokensPrice = useCallback(async () => {
    try {
      const response = await fetch(
        "https://interview.switcheo.com/prices.json"
      );
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
            logo: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`,
          });
        }
      });

      setTokensData(formatData);
      setInData({
        ...inData,
        symbol: formatData?.[0]?.symbol,
      });
    } catch (error) {
      console.log(error);
    }
  }, [inData]);

  useEffect(() => {
    handleGetTokensPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inData?.value && outData?.value && outData?.symbol) {
      setIsError(false);
    }
  }, [inData?.value, outData?.symbol, outData?.value]);

  return (
    <>
      <Flex justify="center" align="center" className="w-screen h-screen">
        <div className="rounded-3xl swap-currency-form">
          <Flex
            gap="2"
            direction="column"
            className="bg-secondary-black p-6 rounded-3xl">
            <SwapCurrencyInput
              label="You pay"
              {...formatCurrencyProps(inData?.symbol)}
              onSelectToken={handleOpenSelectTokenModal}
              type="in"
              value={inData?.value as number}
              onValueChange={handleCurrencyChange}
              isError={isError}
              currencyErrorMessage="You must input the value you want to pay"
              key={`${isTriggerResetKey}-in`}
            />
            <Flex
              justify="center"
              align="center"
              className="relative w-10 h-10 bg-primary-black border-secondary-black rounded-xl border-4 -my-[26px] mx-auto cursor-pointer"
              onClick={handleSwapCurrency}>
              <Icon icon="tabler:arrow-down" className="text-white" />
            </Flex>
            <SwapCurrencyInput
              label="You receive"
              {...formatCurrencyProps(outData?.symbol)}
              onSelectToken={handleOpenSelectTokenModal}
              type="out"
              value={outData?.value as number}
              onValueChange={handleCurrencyChange}
              isError={isError}
              currencyErrorMessage="You must input the value you want to receive"
              tokenErrorMessage="You must select a token"
              key={`${isTriggerResetKey}-out`}
            />
            <Button
              className={cx("!bg-primary-pink !h-14 !rounded-2xl !text-white", {
                "!bg-primary-grey": isError,
              })}
              onClick={handleSubmitSwapCurrency}
              disabled={isError}>
              Swap
            </Button>
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
