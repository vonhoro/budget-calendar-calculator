"use client";
import React from "react";
import { useField } from "formik";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";

export const InputField = ({ label, mt, textArea, ...props }) => {
  const [field, { error, initialTouched }, { setValue }] = useField(props);

  const [numberInputValue, setNumberInputValue] = React.useState(
    props["defaultValue"],
  );

  return (
    <>
      <FormControl mt={mt} isInvalid={error && field.value}>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
        {textArea
          ? (
            <Textarea
              {...field}
              {...props}
              id={field.name}
              placeholder={props.placeholder}
              borderColor="gray.400"
              _hover={{ borderColor: "orange.400" }}
            />
          )
          : props["type"] === "number"
          ? (
            <NumberInput
              {...props}
              onChange={(valueString) => {
                if (!props["modifier"]) {
                  setNumberInputValue(valueString);
                  setValue(parseFloat(valueString));
                  if (props["getValue"]) {
                    props["getValue"](
                      parseFloat(valueString),
                    );
                  }
                  return;
                }
                setValue(
                  parseFloat(valueString.replace(props["modifier"], "")),
                );
                setNumberInputValue(valueString.replace(props["modifier"], ""));

                if (props["getValue"]) {
                  props["getValue"](
                    valueString.replace(props["modifier"], ""),
                  );
                }
              }}
              value={numberInputValue}
            >
              <NumberInputField />
              <NumberInputStepper bg="white">
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )
          : (
            <Input
              {...field}
              {...props}
              id={field.name}
              placeholder={props.placeholder}
              borderColor="gray.400"
              _hover={{ borderColor: "orange.400" }}
            />
          )}
        <FormErrorMessage mt={-2} mb={-4}>
          {error}
        </FormErrorMessage>
      </FormControl>
    </>
  );
};
