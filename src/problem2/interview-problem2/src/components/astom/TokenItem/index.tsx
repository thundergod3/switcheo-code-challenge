import { Flex, Text } from "@radix-ui/themes";
import React, { FC } from "react";

type IProps = ITokenItem & {
  onSelectToken?: (data: string) => void;
};

const TokenItem: FC<IProps> = ({ logo, symbol, onSelectToken }) => {
  return (
    <Flex
      align="center"
      className="gap-4 px-5 py-2 cursor-pointer hover:bg-secondary-softGrey"
      onClick={() => onSelectToken?.(symbol)}>
      <img src={logo} alt={symbol} className="w-9 h-9 rounded-full" />
      <Flex direction="column" className="gap-1">
        <Text className="text-white">{symbol}</Text>
      </Flex>
    </Flex>
  );
};

export default TokenItem;
