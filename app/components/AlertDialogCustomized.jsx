"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

export const AlertDialogCustomized = ({
  onAccept,
  onCancel,
  isOpen,
  leastDestructiveRef,
  onClose,
  Header,
  Body,
  isLoading,
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={leastDestructiveRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {Header}
          </AlertDialogHeader>

          <AlertDialogBody>{Body}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={leastDestructiveRef} onClick={onCancel}>
              No
            </Button>
            <Button
              colorScheme="red"
              isLoading={isLoading}
              onClick={onAccept}
              ml={3}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
