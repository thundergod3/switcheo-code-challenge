import { Flex, Text } from "@radix-ui/themes";
import React, { FC } from "react";

import SwapButton, { ISwapButtonProps } from "../SwapButton";
import { CurrencyInputTypes } from "src/types/enums";

type IProps = ISwapButtonProps & {
  label: string;
  dollarValue?: number;
  value?: number;
  onValueChange: (value: number, type: string) => void;
  isError?: boolean;
  currencyErrorMessage?: string;
  tokenErrorMessage?: string;
  disabled?: boolean;
};

const SwapCurrencyInput: FC<IProps> = ({
  label,
  dollarValue = 0,
  value,
  onValueChange,
  type = CurrencyInputTypes.in,
  isError,
  currencyErrorMessage,
  tokenErrorMessage,
  disabled,
  ...rest
}) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="bg-primary-black rounded-2xl p-4 flex flex-col gap-2 pr-7">
      <Text className="text-primary-grey text-sm pl-3">{label}</Text>
      <div className="flex items-center justify-between gap-2 sm:gap-0">
        <div className="flex flex-grow-[1]">
          <input
            key={type}
            className="border-none outline-none focus:outline-none text-4xl font-medium text-white max-h-[44px] bg-transparent rounded-2xl w-[0px] flex-auto pointer-events-auto pl-3"
            placeholder="0"
            type="number"
            value={value}
            onChange={(event) =>
              onValueChange?.(event.target.value as any, type)
            }
            disabled={disabled}
            minLength={1}
            maxLength={79}
          />
        </div>
        <SwapButton type={type} {...rest} />
      </div>
      {isError && !value && (
        <div className="flex flex-col gap-1 pl-3">
          {currencyErrorMessage && (
            <Text className="text-xs text-red-500">{currencyErrorMessage}</Text>
          )}
          {tokenErrorMessage && (
            <Text className="text-xs text-red-500">{tokenErrorMessage}</Text>
          )}
        </div>
      )}
      <Flex
        align="center"
        className={`min-h-6 pl-3 ${
          rest?.tokenImage && dollarValue > 0 ? "opacity-100" : "opacity-0"
        }`}>
        <Text className="text-primary-grey text-xs">
          {formatter.format(dollarValue)}
        </Text>
      </Flex>
    </div>
  );
};

export default SwapCurrencyInput;
