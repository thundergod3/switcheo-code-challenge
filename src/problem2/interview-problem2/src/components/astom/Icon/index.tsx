"use client";

import { Icon as Iconify, IconProps } from "@iconify/react";

const Icon = ({ icon, ...rest }: IconProps) => {
  return <Iconify icon={icon} height={"1em"} fontSize="1.25rem" {...rest} />;
};

export default Icon;
