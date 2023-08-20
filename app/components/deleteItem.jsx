"use Client";

import React from "react";
import { AlertDialogCustomized } from "./AlertDialogCustomized";
import { Button } from "@chakra-ui/react";
export const DeleteItem = ({ id, date, removeItem }) => {
  const [openALert, setOpenAlert] = React.useState(false);
  const [openAlertLoad, setOpenAlertLoad] = React.useState(false);
  const alertRef = React.useRef();
  const onCloseAlert = () => setOpenAlert(false);

  const deleteItem = async () => {
    setOpenAlertLoad(true);
    const baseUrl = window.location.origin;

    console.log("a");
    const response = await fetch(`${baseUrl}/api/items`, {
      cache: "no-store",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "same-origin",
      body: JSON.stringify({ _id: id }),
    });

    removeItem({ action: "Remove", oldData: { _id: id, date } });
    setOpenAlertLoad(false);

    onCloseAlert();
  };

  return (
    <>
      <Button onClick={() => setOpenAlert(!openALert)}>Delete</Button>
      <AlertDialogCustomized
        isOpen={openALert}
        isLoading={openAlertLoad}
        leastDestructiveRef={alertRef}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onAccept={deleteItem}
        Header={"Delete Item"}
        Body={"Are you sure you wanna doit"}
      />
    </>
  );
};
