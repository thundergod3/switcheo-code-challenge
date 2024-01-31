import { Flex, Text } from "@radix-ui/themes";
import React, { FC } from "react";

import SwapButton, { ISwapButtonProps } from "../SwapButton";

type IProps = ISwapButtonProps & {
  label: string;
  dollarValue?: number;
  value?: number;
  onValueChange: (value: number, type: string) => void;
  isError?: boolean;
  currencyErrorMessage?: string;
  tokenErrorMessage?: string;
};

const SwapCurrencyInput: FC<IProps> = ({
  label,
  dollarValue = 0,
  value,
  onValueChange,
  type = "in",
  isError,
  currencyErrorMessage,
  tokenErrorMessage,
  ...rest
}) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Flex
      direction="column"
      gap="2"
      className="bg-primary-black rounded-2xl p-4">
      <Text className="text-primary-grey text-sm">{label}</Text>
      <Flex justify="between" align="center">
        <Flex direction="column" className="gap-2">
          <input
            key={type}
            className="border-none outline-none focus:outline-none text-4xl font-medium text-white max-h-[44px] bg-transparent rounded-2xl"
            placeholder="0"
            type="number"
            value={value}
            onChange={(event) =>
              onValueChange?.(event.target.value as any, type)
            }
          />
          {isError && !value && (
            <Text className="text-xs text-red-500">{currencyErrorMessage}</Text>
          )}
        </Flex>
        <Flex>
          <SwapButton
            type={type}
            isError={isError}
            errorMessage={tokenErrorMessage}
            {...rest}
          />
        </Flex>
      </Flex>
      {rest?.tokenImage && (
        <Flex align="center" className="min-h-6">
          <Text className="text-primary-grey text-xs">
            {formatter.format(dollarValue)}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default SwapCurrencyInput;
