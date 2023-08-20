"use client";
import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { InputField } from "./InputField";
import { Form, Formik } from "formik";

export const OptionsDrawer = (
  { changeCalendarMonth, currentDate, budget, changeBudget },
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const [calendarDate, setCalendarDate] = React.useState(null);
  const [budgetValue, setBudgetValue] = React.useState(budget);

  const applyChanges = () => {
    if (calendarDate) {
      changeCalendarMonth(calendarDate);
    }

    if (budgetValue) {
      changeBudget(budgetValue);
    }

    onClose();
  };

  const onChange = ({ target }) => {
    const { value, name } = target;

    switch (name) {
      case "date":
        const month = parseInt(value.slice(5, 7)) - 1;
        const year = parseInt(value.slice(0, 4));

        setCalendarDate({ month, year });

        break;
      case "budget":
        setBudgetValue(value);
        break;
    }
  };

  return (
    <>
      <Button
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
        left="1vw"
        top="1vh"
        zIndex="9999"
        position="fixed"
      >
        Options
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Manage Options</DrawerHeader>

          <DrawerBody>
            <Formik
              initialValues={{
                date: new Date(currentDate["year"], currentDate["month"], 1)
                  .toISOString().slice(0, 10),
                budget: budget,
              }}
            >
              {({ values, handleChange }) => (
                <Form
                  onChange={onChange}
                >
                  <InputField
                    name="date"
                    type="date"
                    label="Change Date"
                    onChange={handleChange}
                  />
                  <InputField
                    mt="10vh"
                    name="budget"
                    type="number"
                    label="Change Monthly Budget"
                    defaultValue={budget}
                    getValue={(v) =>
                      onChange({
                        target: {
                          name: "budget",
                          value: v,
                        },
                      })}
                    min={0}
                  />
                </Form>
              )}
            </Formik>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              colorScheme={"blue"}
              mr={3}
              onClick={applyChanges}
            >
              Save
            </Button>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
