'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
interface CalendarContextProps {
  taskDates: string[];
  highlightedDays: number[];
  SelectedDate: Date;
  setDay: (day: Date) => void;
  setHighlightedDate: (days: number[]) => void;
  setTaskDates: (taskDates: string[]) => void;
}
const CalendarContext = createContext<CalendarContextProps>({
  SelectedDate: new Date(Date.now()),
  highlightedDays: [],
  taskDates: [],
  setTaskDates: () => {},
  setDay: () => {},
  setHighlightedDate: () => {},
});

export const CalendarProvider = ({
  children,
  InitialTaskDates = [],
}: {
  children: React.ReactNode;
  InitialTaskDates: string[];
}) => {
  const [taskDates, setTaskDates] = useState<string[]>(InitialTaskDates);
  const [SelectedDate, setDate] = useState<Date>(new Date(Date.now()));
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);
  useEffect(() => {
    setTaskDates(InitialTaskDates);
  }, [InitialTaskDates]);

  return (
    <CalendarContext.Provider
      value={{
        setTaskDates,
        taskDates,
        SelectedDate,
        setDay: setDate,
        highlightedDays,
        setHighlightedDate: setHighlightedDays,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
export const useSelectedDate = () => useContext(CalendarContext);
