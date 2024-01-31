import React, { ButtonHTMLAttributes, FC, ReactNode, useCallback } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../DialogCustom";
import { Button } from "../Button";

type IProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  content: ReactNode;
  textConfirm?: string;
  textCancel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmButtonProps?: Partial<ButtonHTMLAttributes<HTMLButtonElement>>;
  cancelButtonProps?: Partial<ButtonHTMLAttributes<HTMLButtonElement>>;
};

const ConfirmDialog: FC<IProps> = ({
  open,
  onOpenChange,
  title,
  content,
  textConfirm = "Confirm",
  textCancel = "Cancel",
  confirmButtonProps,
  cancelButtonProps,
  onCancel,
  onConfirm,
}) => {
  const handleClose = useCallback(
    (value: boolean) => {
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  const handleCancel = useCallback(() => {
    onCancel?.();
    handleClose(false);
  }, [handleClose, onCancel]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    handleClose(false);
  }, [handleClose, onConfirm]);

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{content}</DialogDescription>
        <DialogFooter>
          <Button
            variant={"outline"}
            {...cancelButtonProps}
            onClick={handleCancel}>
            {textCancel}
          </Button>
          <Button {...confirmButtonProps} onClick={handleConfirm}>
            {textConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
