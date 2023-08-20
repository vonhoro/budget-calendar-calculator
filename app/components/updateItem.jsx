"use Client";

import React from "react";
import { ItemForm } from "./itemForm";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

export const UpdateItem = ({ Data, updateInfo, index }) => {
  const [valid, setValid] = React.useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    setSubmitting(true);
    const baseUrl = window.location.origin;
    const response = await fetch(`${baseUrl}/api/items`, {
      cache: "no-store",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "same-origin",
      body: JSON.stringify(values),
    });
    const newData = await response.json();
    // const newData = values;

    updateInfo({
      oldData: Data,
      newData,
      action: "Update",
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>Edit</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        bg="blue.100"
      >
        <ModalOverlay />
        <ModalContent bg="blue.800" color="white">
          <ModalHeader>Update item</ModalHeader>
          <ModalCloseButton />
          <ModalBody alignContent="center">
            <Box textAlign="left" pl={10} pr={10}>
              <ItemForm Data={Data} onSubmit={onSubmit} />
            </Box>
          </ModalBody>

          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
