import { Icon } from "@iconify/react";
import { Flex } from "@radix-ui/themes";
import React, { FC, useEffect, useState } from "react";

export type ISearchInputProps = {
  onSearchChange?: (data: string) => void;
  placeholder?: string;
};

const SearchInput: FC<ISearchInputProps> = ({
  onSearchChange,
  placeholder,
}) => {
  const [debouncedText, setDebouncedText] = useState<string>("");

  useEffect(() => {
    if (debouncedText !== undefined) {
      const timeout = setTimeout(() => onSearchChange?.(debouncedText), 400);
      return () => {
        clearTimeout(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  return (
    <Flex
      align="center"
      className="px-3 py-2 text-white border border-secondary-grey gap-2 bg-primary-black rounded-xl">
      <Icon icon="tabler:search" className="text-white" />
      <input
        placeholder={placeholder}
        value={debouncedText}
        onChange={(event) => setDebouncedText(event?.target.value)}
        className="border-none outline-none shadow-none bg-transparent font-medium text-base"
      />
    </Flex>
  );
};

export default SearchInput;
