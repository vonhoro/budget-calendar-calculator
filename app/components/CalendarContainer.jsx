"use client";
import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Grid,
  Heading,
  Icon,
  Text,
} from "@chakra-ui/react";
// import { ErrorAlert } from "../components/ErrorAlert";

import { calendarSetupHooks } from "../hooks/calendarSetupHooks";

import {
  RiArrowLeftCircleFill,
  RiArrowLeftSLine,
  RiArrowRightCircleFill,
  RiArrowRightSLine,
} from "react-icons/ri";

import { CalendarSquare } from "./CalendarSquare";
import { OptionsDrawer } from "./optionsDrawer";

const daysOfTheWeek = [
  { number: 1, name: "Monday" },
  { number: 2, name: "Tuesday" },
  { number: 3, name: "Wednesday" },
  { number: 4, name: "Thursday" },
  { number: 5, name: "Friday" },
  { number: 6, name: "Saturday" },
  { number: 0, name: "Sunday" },
];

export const CalendarContainer = ({ Data = [], calendarDates }) => {
  const [monthBudget, setMonthBudget] = React.useState(500);
  const [reload, setReload] = React.useState(false);

  const [error, setError] = React.useState(false);

  const {
    calendarData,
    dispatchCalendarData,
    date,
    dispatchDate,
    getMonth,
    getYear,
    data,
    setData,
    changeCalendarMonth,
  } = calendarSetupHooks({ calendarDates, Data, monthBudget });
  const skippingDays = ({ calendarData, monthUsed, prev }) => {
    const daysOfMonth = calendarData[date["year"]][monthUsed]["days"];

    if (prev) {
      const number = daysOfMonth[0]["dayOfWeek"] - 1;
      if (number < 0) return -6;
      if (number === 0) return 32;
      return -1 * number;
    }
    const number = daysOfMonth[daysOfMonth.length - 1]["dayOfWeek"];
    if (number === 0) return 0;

    return 7 - number;
  };

  const closeAlert = () => {
    setError(false);
  };

  const handleError = (error) => {
    setError(true);
    dispatchCalendarData({ action: "Set Up" });
    setFetching(false);
    console.log(error);
  };
  //Set Data
  React.useEffect(() => {
    dispatchCalendarData({ action: "Set Up" });
    setReload(!reload);
  }, [Data]);

  const UpdateData = async (
    { newData, oldData, action },
  ) => {
    if (action !== "Remove" && action !== "Add" && action !== "Update") return;
    dispatchCalendarData({ action, newData, oldData });
    setReload(!reload);
  };

  React.useEffect(() => {
    dispatchCalendarData({ action: "Set Up" });
    setReload(!reload);
  }, [monthBudget]);

  return (
    <Box bg="blue.900" h="100vh">
      <OptionsDrawer
        changeCalendarMonth={changeCalendarMonth}
        budget={monthBudget}
        changeBudget={(newBudget) => {
          setMonthBudget(newBudget);
        }}
        currentDate={date}
      />
      <Flex
        direction="column"
        align="center"
        justify="center"
        bg="blue.900"
      >
        <Flex w="100%" align="center" justify="center" mt="1vh">
          {" "}
          <Icon
            as={RiArrowLeftCircleFill}
            style={{ cursor: "pointer" }}
            boxSize={"3em"}
            color="red"
            onClick={() => {
              if (!calendarData[date["year"] - 1]) {
                dispatchCalendarData({
                  action: "Add Year",
                  yearToAdd: date["year"] - 1,
                });
              }
              dispatchDate({ action: "decrease" });
              dispatchCalendarData({ action: "Set Before" });
              setReload(!reload);
            }}
          />
          <Heading color="white" textAlign="center" w="10em">
            {calendarData[date["year"]][date["month"]]["month"]} {date["year"]}
          </Heading>
          <Icon
            as={RiArrowRightCircleFill}
            style={{ cursor: "pointer" }}
            boxSize={"3em"}
            color="red"
            onClick={() => {
              if (!calendarData[date["year"] + 1]) {
                dispatchCalendarData({
                  action: "Add Year",
                  yearToAdd: date["year"] + 1,
                });
              }
              dispatchDate({ action: "increase" });
              dispatchCalendarData({ action: "Set Next" });
              setReload(!reload);
            }}
          />
        </Flex>
        <Grid
          mt="1vh"
          bg="blue.700"
          w="90vw"
          h="5vh"
          templateColumns="repeat(7, 1fr)"
          alignContent="center"
          justifyContent="center"
        >
          {daysOfTheWeek.map(({ name, number }) => (
            <Box
              key={number}
            >
              <Heading textAlign="center" color="white" size="lg">
                {name}
              </Heading>
            </Box>
          ))}
        </Grid>
        <Grid
          bg="blue.800"
          w="90vw"
          templateColumns="repeat(7, 1fr)"
          alignContent="center"
          justifyContent="center"
        >
          {calendarData[
            getYear({ type: "before", ...date })
          ][getMonth({ type: "before", ...date })]["days"]
            .slice(
              skippingDays({
                calendarData,
                monthUsed: date["month"],
                prev: true,
              }),
            )
            .map(
              (
                {
                  date,
                  day,
                  ...rest
                },
                i,
              ) => {
                const {
                  altered,
                  dayOfWeek,
                  isOverBudget,
                  totalAccumulated,
                  maxExpentPerDay,
                  ...dayData
                } = rest;
                return (
                  <CalendarSquare
                    Past
                    isOverBudget={isOverBudget}
                    totalAccumulated={totalAccumulated}
                    maxExpentPerDay={maxExpentPerDay}
                    key={i}
                    dayData={dayData}
                    date={date}
                    day={day.toString().padStart(2, "0")}
                    UpdateData={UpdateData}
                    reload={reload}
                  />
                );
              },
            )}
          {calendarData[date["year"]][date["month"]]["days"].map(
            (
              {
                date,
                day,
                ...rest
              },
              i,
            ) => {
              const {
                altered,
                dayOfWeek,
                isOverBudget,
                totalAccumulated,
                maxExpentPerDay,
                ...dayData
              } = rest;
              return (
                <CalendarSquare
                  isOverBudget={isOverBudget}
                  totalAccumulated={totalAccumulated}
                  maxExpentPerDay={maxExpentPerDay}
                  key={i}
                  dayData={dayData}
                  date={date}
                  day={day.toString().padStart(2, "0")}
                  UpdateData={UpdateData}
                  reload={reload}
                />
              );
            },
          )}
          {calendarData[
            getYear({ type: "after", ...date })
          ][getMonth({ type: "after", ...date })]["days"]
            .slice(0, skippingDays({ calendarData, monthUsed: date["month"] }))
            .map(
              (
                {
                  date,
                  day,
                  ...rest
                },
                i,
              ) => {
                const {
                  altered,
                  dayOfWeek,
                  isOverBudget,
                  totalAccumulated,
                  maxExpentPerDay,
                  ...dayData
                } = rest;
                return (
                  <CalendarSquare
                    Future
                    isOverBudget={isOverBudget}
                    totalAccumulated={totalAccumulated}
                    maxExpentPerDay={maxExpentPerDay}
                    key={i}
                    dayData={dayData}
                    date={date}
                    day={day.toString().padStart(2, "0")}
                    UpdateData={UpdateData}
                    reload={reload}
                  />
                );
              },
            )}
        </Grid>
      </Flex>
    </Box>
  );
};
