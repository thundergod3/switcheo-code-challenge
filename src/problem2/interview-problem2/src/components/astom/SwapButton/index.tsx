import React, { FC } from "react";
import cx from "classnames";
import Icon from "../Icon";
import { Flex, Text } from "@radix-ui/themes";

import { CurrencyInputTypes } from "src/types/enums";

export type ISwapButtonProps = {
  type?: CurrencyInputTypes;
  isToken?: boolean;
  isActive?: boolean;
  text?: string;
  tokenImage?: string;
  isArrow?: boolean;
  onSelectToken?: (data: string, type?: CurrencyInputTypes) => void;
  isError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  placeholder?: string;
};

const SwapButton: FC<ISwapButtonProps> = ({
  type,
  tokenImage,
  isToken,
  isActive,
  text,
  isArrow = true,
  onSelectToken,
  isError,
  errorMessage,
  disabled,
  placeholder,
}) => {
  return (
    <Flex direction="column" gap="2">
      <button
        disabled={disabled}
        className={cx(
          "bg-primary-pink p-2 border border-primary-pink rounded-3xl font-medium text-white shadow-none w-fit flex items-center",
          {
            "bg-secondary-black border-secondary-black hover:bg-primary-black":
              isToken,
            "!bg-primary-black": isActive,
            "opacity-20": disabled,
          }
        )}
        onClick={() => onSelectToken?.(text || "", type)}>
        {tokenImage && (
          <img
            src={tokenImage}
            alt="Token"
            className="w-6 h-6 rounded-full mr-1"
          />
        )}

        <span>{text || placeholder}</span>
        {isArrow && (
          <Icon icon="tabler:chevron-down" className="text-white ml-2" />
        )}
      </button>
      {isError && !tokenImage && (
        <Text className="text-xs text-red-500">{errorMessage}</Text>
      )}
    </Flex>
  );
};

export default SwapButton;
