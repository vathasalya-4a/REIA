import React from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface CalendarProps {
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
}

export default function Calendar({ selectedDates, setSelectedDates }: CalendarProps) {
  const handleDateChange = (date: Date) => {
    if (selectedDates.find((d) => d.toDateString() === date.toDateString())) {
      setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <ReactCalendar
      onClickDay={handleDateChange}
      tileClassName={({ date }) =>
        selectedDates.find((d) => d.toDateString() === date.toDateString())
          ? "bg-blue-500 text-white"
          : ""
      }
    />
  );
}
