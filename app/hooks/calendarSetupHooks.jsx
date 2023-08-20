import React from "react";
import sortCalendarDates from "../utils/sortCalendarDates";
const isEmptyObject = (obj) => {
  for (const prop in obj) {
    return false;
  }
  return true;
};
const calculateExpenses = (data, dayData) => {
  let hasOne = false;
  const expenses = data.reduce((a, info) => {
    if (info["date"] === dayData["date"]) {
      hasOne = true;
      a[info["_id"]] = info;
    }

    return a;
  }, {});
  return hasOne ? expenses : null;
};

export const calendarSetupHooks = ({ calendarDates, Data, monthBudget }) => {
  const [data, setData] = React.useState(Data);

  const getYear = ({ type, year, month }) => {
    switch (type) {
      case "before":
        if (month > 0) return year;
        return year - 1;
        break;

      case "after":
        if (month > 10) return year + 1;
        return year;
        break;
    }
  };
  const getMonth = ({ type, month }) => {
    switch (type) {
      case "before":
        if (month > 0) return month - 1;
        return 11;
        break;

      case "after":
        if (month < 11) return month + 1;
        return 0;
        break;
    }
  };

  const changeDate = (state, { action, newYear, newMonth }) => {
    const { month, year } = state;

    let newState;
    if (action === "increase" && month < 11) return { month: month + 1, year };
    if (action === "increase" && month === 11) {
      return { month: 0, year: year + 1 };
    }
    if (action === "decrease" && month < 1) {
      return { month: 11, year: year - 1 };
    }
    if (action === "decrease" && month > 0) {
      return { month: month - 1, year };
    }

    if (action === "change") {
      return { month: newMonth, year: newYear };
    }
  };

  const [date, dispatchDate] = React.useReducer(changeDate, {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const calculateOverBudget = ({ daysData = [] }) => {
    if (daysData.length === 0) return;
    const totalPerDay = monthBudget / daysData.length;
    let totalAccumulated = 0;
    daysData.forEach(({ expenses, day }, index) => {
      const maxExpentPerDay = totalPerDay * day;
      if (expenses) {
        Object.values(expenses).forEach(({ amount = 0 }) => {
          totalAccumulated += amount;
        });
      }
      if (totalAccumulated > maxExpentPerDay) {
        daysData[index]["isOverBudget"] = true;
      } else {
        daysData[index]["isOverBudget"] = false;
      }
      daysData[index]["totalAccumulated"] = totalAccumulated;
      daysData[index]["maxExpentPerDay"] = maxExpentPerDay;
    });
  };

  const updateCalendarData = (
    state,
    { action, yearToAdd, oldData, newData },
  ) => {
    if (action === "Set Up") {
      let changedPresentMonth, changedPastMonth, changedNextMonth;
      state[date["year"]][date["month"]]["days"].map((dayData) => {
        const expenses = calculateExpenses(data, dayData);
        if (expenses) {
          dayData["expenses"] = expenses;
          dayData["altered"] = true;
          changedPresentMonth = true;
        }

        return dayData;
      });

      state[
        getYear({ type: "before", ...date })
      ][getMonth({ type: "before", ...date })]["days"].map(
        (dayData) => {
          const expenses = calculateExpenses(data, dayData);
          if (expenses) {
            dayData["expenses"] = expenses;
            dayData["altered"] = true;
            changedPastMonth = true;
          }

          return dayData;
        },
      );

      state[
        getYear({ type: "after", ...date })
      ][getMonth({ type: "after", ...date })]["days"].map((dayData) => {
        const expenses = calculateExpenses(data, dayData);
        if (expenses) {
          dayData["expenses"] = expenses;
          dayData["altered"] = true;
          changedNextMonth = true;
        }

        return dayData;
      });

      if (changedPresentMonth) {
        calculateOverBudget({
          daysData: state[date["year"]][date["month"]]["days"],
        });
      }

      if (changedPastMonth) {
        calculateOverBudget({
          daysData: state[
            getYear({ type: "before", ...date })
          ][getMonth({ type: "before", ...date })]["days"],
        });
      }

      if (changedNextMonth) {
        calculateOverBudget({
          daysData: state[
            getYear({ type: "after", ...date })
          ][getMonth({ type: "after", ...date })]["days"],
        });
      }

      return state;
    }
    if (action === "Set Next") {
      if (
        state[
          getYear({ type: "after", ...date })
        ][getMonth({ type: "after", ...date })]["days"][0]["altered"]
      ) {
        return state;
      }
      state[
        getYear({ type: "after", ...date })
      ][getMonth({ type: "after", ...date })]["days"].map((dayData) => {
        const expenses = calculateExpenses(data, dayData);
        if (expenses) {
          dayData["expenses"] = expenses;
          dayData["altered"] = true;
        }

        return dayData;
      });

      return state;
    }
    if (action === "Set Before") {
      if (
        state[
          getYear({ type: "before", ...date })
        ][getMonth({ type: "before", ...date })]["days"][0]["altered"]
      ) {
        return state;
      }

      state[
        getYear({ type: "before", ...date })
      ][getMonth({ type: "before", ...date })]["days"].map((dayData) => {
        const expenses = calculateExpenses(data, dayData);
        if (expenses) {
          dayData["expenses"] = expenses;
          dayData["altered"] = true;
        }

        return dayData;
      });

      return state;
    }
    if (action === "Add") {
      const year = parseInt(newData["date"].slice(0, 4));
      const month = parseInt(newData["date"].slice(6, 8)) - 1;
      const day = parseInt(newData["date"].slice(-2)) - 1;

      const arrayInUse = state[year][month]["days"][day];

      if (!arrayInUse["expenses"]) {
        arrayInUse["expenses"] = {};
      }
      arrayInUse["expenses"][[newData["_id"]]] = newData;

      calculateOverBudget({ daysData: state[year][month]["days"] });
      return state;
    }

    if (action === "Remove") {
      const year = parseInt(oldData["date"].slice(0, 4));
      const month = parseInt(oldData["date"].slice(6, 8)) - 1;
      const day = parseInt(oldData["date"].slice(-2)) - 1;

      delete state[year][month]["days"][day]["expenses"][oldData["_id"]];

      if (isEmptyObject(state[year][month]["days"][day]["expenses"])) {
        delete state[year][month]["days"][day]["expenses"];
      }

      return state;
    }
    if (action === "Update") {
      const newYear = parseInt(newData["date"].slice(0, 4));
      const newMonth = parseInt(newData["date"].slice(6, 8)) - 1;
      const newDay = parseInt(newData["date"].slice(-2)) - 1;

      if (oldData["date"] !== newData["date"]) {
        const oldYear = parseInt(oldData["date"].slice(0, 4));
        const oldMonth = parseInt(oldData["date"].slice(6, 8)) - 1;
        const oldDay = parseInt(oldData["date"].slice(-2)) - 1;

        delete state[oldYear][oldMonth]["days"][oldDay]["expenses"][
          oldData["_id"]
        ];
        if (
          isEmptyObject(state[oldYear][oldMonth]["days"][oldDay]["expenses"])
        ) {
          delete state[oldYear][oldMonth]["days"][oldDay]["expenses"];
        }
      }

      if (
        !state[newYear][newMonth]["days"][newDay]["expenses"]
      ) {
        state[newYear][newMonth]["days"][newDay]["expenses"] = {};
      }
      state[newYear][newMonth]["days"][newDay]["expenses"][newData["_id"]] =
        newData;

      calculateOverBudget({ daysData: state[newYear][newMonth]["days"] });
      return state;
    }

    if (action === "Clean") {
    }
    if (action === "Add Year") {
      if (!yearToAdd) return state;
      if (state[yearToAdd]) return state;

      state[yearToAdd] = sortCalendarDates(yearToAdd);

      return state;
    }

    return state;
  };

  const [calendarData, dispatchCalendarData] = React.useReducer(
    updateCalendarData,
    calendarDates,
  );

  const changeCalendarMonth = ({ month, year }) => {
    if (!calendarData[year]) {
      dispatchCalendarData({
        action: "Add Year",
        yearToAdd: year,
      });
    }
    if (!calendarData[year + 1]) {
      dispatchCalendarData({
        action: "Add Year",
        yearToAdd: year + 1,
      });
    }

    if (!calendarData[year - 1]) {
      dispatchCalendarData({
        action: "Add Year",
        yearToAdd: year - 1,
      });
    }
    dispatchDate({ action: "change", newMonth: month, newYear: year });
  };

  return {
    calendarData,
    dispatchCalendarData,
    date,
    dispatchDate,
    getMonth,
    getYear,
    data,
    setData,
    changeCalendarMonth,
  };
};
