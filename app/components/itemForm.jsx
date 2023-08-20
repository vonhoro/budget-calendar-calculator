"use client";
import React from "react";
import { InputField } from "./InputField";
import { Form, Formik } from "formik";

import { Button } from "@chakra-ui/react";

export const ItemForm = ({ Data, onSubmit }) => {
  const [valid, setValid] = React.useState(true);
  return (
    <Formik
      initialValues={Data ? { ...Data } : {}}
      onSubmit={onSubmit}
    >
      {({ values, handleChange, isSubmitting, isValid }) => (
        <Form>
          <InputField
            name="date"
            type="date"
            label="Transaction Date"
          />
          <InputField
            mt={4}
            textArea
            name="description"
            placeholder="update description"
            label="Description"
          />

          <InputField
            mt={4}
            textArea
            name="personalDetails"
            placeholder="update description"
            label="Personal details"
          />
          <InputField
            mt={4}
            defaultValue={Data["amount"] ?? 0}
            modifier="$"
            min={0}
            precision={2}
            type="number"
            name="amount"
            label="Amount"
          />
          <InputField
            mt={4}
            name="referenceNumber"
            placeholder=""
            label="Reference"
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            colorScheme="orange"
            width="full"
            mt={4}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};
