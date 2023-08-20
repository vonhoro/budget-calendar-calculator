"use client";

import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { CalendarSquareList } from "./CalendarSquareList";
import { CreateItem } from "./createItem";
const roundTo2Decimals = (number) => Number.parseFloat(number).toFixed(2);
export const CalendarSquare = ({
  isOverBudget,
  totalAccumulated,
  maxExpentPerDay,
  date,
  day,
  dayData,
  reload,
  Past,
  Future,
  UpdateData,
}) => {
  const [totalExpent, setTotalExpent] = React.useState(0);
  const [dayDataKeys, setDayDataKeys] = React.useState([]);
  const [dayDataValues, setDayDataValues] = React.useState(
    [],
  );

  React.useEffect(() => {
    if (!dayData) return;
    if (dayData["expenses"]) {
      const totalExpenses = Object.values(dayData["expenses"]).reduce(
        (a, { amount = 0 }) => {
          return a += amount;
        },
        0,
      );
      setTotalExpent(totalExpenses);
    }

    setDayDataKeys(
      Object.keys(dayData).map((word) => `
        ${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`),
    );

    const prepareDataValuesAsArray = Object.values(dayData).map((data) => {
      if (data === null) return data;
      if (Array.isArray(data)) return data;
      if (typeof data === "object") return Object.values(data);

      return data;
    });
    setDayDataValues(prepareDataValuesAsArray);
  }, [reload]);

  return (
    <Flex
      w={`${90 / 7}vw`}
      minH={`${90 / 5}vh`}
      border="1px"
      borderColor="gray.200"
      direction="column"
      bg={isOverBudget ? "red.800" : `${Past ? "grey" : Future ? "black" : ""}`}
      alignContent="center"
      pb="2vh"
    >
      <Text fontSize="xl" textAlign="right" alignSelf="left" color="white">
        {day}
      </Text>

      {dayDataKeys.map((name, index) => (
        <CalendarSquareList
          key={index.toString()}
          MarginButtom="0.5em"
          Information={dayDataValues[index] ?? []}
          NameOnList={{
            prevText: dayDataValues[index].map((_, i) => `Transaction $`),
            keyToUse: "amount",
          }}
          Name={name}
          hasDetail
          SelectorColor="orange.700"
          LettersColor="white"
          ColapseColor="orange.400"
          UpdateData={UpdateData}
        />
      ))}
      {
        <CalendarSquareList
          MarginButtom="0.5em"
          Information={[
            { total: roundTo2Decimals(totalExpent) },
            { total: roundTo2Decimals(totalAccumulated) },
            { total: roundTo2Decimals(maxExpentPerDay) },
            { total: roundTo2Decimals(maxExpentPerDay - totalAccumulated) },
          ]}
          NameOnList={{
            prevText: [
              "Day Total = $",
              "MTD Total = $",
              "Budget Total = $",
              "Difference = $",
            ],
            keyToUse: "total",
          }}
          Name={"Totals"}
          SelectorColor="red.600"
          LettersColor="white"
          ColapseColor="red.200"
          UpdateData={UpdateData}
        />
      }

      <CreateItem Data={{ date }} afterSubmit={UpdateData} />
    </Flex>
  );
};
