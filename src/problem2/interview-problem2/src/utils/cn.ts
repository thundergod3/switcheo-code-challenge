import cx from "classnames";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any) {
  return twMerge(cx(inputs));
}
