import { Flex, ScrollArea, Separator, Text } from "@radix-ui/themes";
import React, { FC, Fragment, useCallback, useMemo } from "react";

import SearchInput, {
  ISearchInputProps,
} from "src/components/astom/SearchInput";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/components/astom/DialogCustom";
import SwapButton from "src/components/astom/SwapButton";
import TokenItem from "src/components/astom/TokenItem";

type IProps = ISearchInputProps & {
  title: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  tokensData?: ITokenItem[];
  onSelectToken?: (data: string) => void;
  keyword?: string;
  value?: string;
  symbolDisabled?: string[];
};

const SelectTokenModal: FC<IProps> = ({
  title,
  open,
  onOpenChange,
  onSelectToken,
  tokensData = [],
  keyword = "",
  value,
  symbolDisabled,
  ...rest
}) => {
  const lowercaseKeyword = useMemo(
    () => keyword?.toLocaleLowerCase(),
    [keyword]
  );
  const searchTokenData = useMemo(
    () =>
      tokensData
        ?.slice(4, tokensData?.length - 1)
        ?.filter((record) =>
          record?.symbol?.toLocaleLowerCase()?.includes(lowercaseKeyword)
        ),
    [lowercaseKeyword, tokensData]
  );

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onInteractOutside={handleClose}>
        <DialogHeader className="gap-4">
          <DialogTitle>{title}</DialogTitle>
          <Flex direction="column" className="gap-2 pb-6">
            <Flex direction="column" className="gap-2 px-6">
              <SearchInput {...rest} />
              <Flex align="center" className="flex-wrap gap-4">
                {tokensData?.slice(0, 4)?.map((record, index) => (
                  <Fragment key={`${record?.symbol}-${index}`}>
                    <SwapButton
                      text={record?.symbol}
                      tokenImage={record?.logo}
                      isArrow={false}
                      isToken
                      onSelectToken={onSelectToken}
                      isActive={value === record?.symbol}
                      disabled={symbolDisabled?.includes(record?.symbol)}
                    />
                  </Fragment>
                ))}
              </Flex>
            </Flex>
            <Separator my="3" size="4" className="!bg-secondary-grey" />
            <Flex direction="column" className="gap-4 mt-2 min-h-[492px]">
              {!searchTokenData?.length ? (
                <Text className="text-white text-2xl text-center">
                  There's no matching token. Please try again
                </Text>
              ) : (
                <>
                  <Text className="text-primary-grey font-medium px-6">
                    Popular tokens
                  </Text>
                  <ScrollArea className="max-h-[452px]">
                    {searchTokenData?.map((record, index) => (
                      <Fragment key={`${record?.symbol}-${index}`}>
                        <TokenItem {...record} onSelectToken={onSelectToken} />
                      </Fragment>
                    ))}
                  </ScrollArea>
                </>
              )}
            </Flex>
          </Flex>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SelectTokenModal;
