const isLeapYear = (year) => {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  if (year % 4 === 0) return true;
  return false;
};

export default (year) => {
  const months = [
    { monthCounter: 0, name: "January", days: 31 },
    { monthCounter: 1, name: "February", days: isLeapYear(year) ? 29 : 28 },
    { monthCounter: 2, name: "March", days: 31 },
    { monthCounter: 3, name: "April", days: 30 },
    { monthCounter: 4, name: "May", days: 31 },
    { monthCounter: 5, name: "June", days: 30 },
    { monthCounter: 6, name: "July", days: 31 },
    { monthCounter: 7, name: "August", days: 31 },
    { monthCounter: 8, name: "September", days: 30 },
    { monthCounter: 9, name: "October", days: 31 },
    { monthCounter: 10, name: "November", days: 30 },
    { monthCounter: 11, name: "December", days: 31 },
  ];
  let dateArrangment = [];

  for (const { name, days, monthCounter } of months) {
    let dayData = [];
    for (let day = 1; day < days + 1; day += 1) {
      const date = new Date(year, monthCounter, day);
      dayData.push({
        date: date.toISOString().slice(0, 10),
        day,
        dayOfWeek: date.getDay(),
      });
    }
    dateArrangment.push({ month: name, days: dayData });
  }

  return dateArrangment;
};
