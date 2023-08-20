import { getItems } from "./api/items/route.js";
import sortCalendarDates from "./utils/sortCalendarDates";

import { CalendarContainer } from "./components/CalendarContainer";

export default async function Home() {
  const data = await getItems();

  const currentYear = new Date().getFullYear();
  const calendarDates = {
    [currentYear - 1]: sortCalendarDates(currentYear - 1),
    [currentYear]: sortCalendarDates(currentYear),
    [currentYear + 1]: sortCalendarDates(currentYear + 1),
  };

  return <CalendarContainer Data={data} calendarDates={calendarDates} />;
}
