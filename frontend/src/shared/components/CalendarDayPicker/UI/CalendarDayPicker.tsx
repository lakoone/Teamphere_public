'use client';
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Colors } from '@/styles/colors/colors';
import { useLocale } from 'use-intl';
import { useSelectedDate } from '@/features/calendar/ui/context/CalendarProvider';
import 'dayjs/locale/pl';
import 'dayjs/locale/uk';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { Badge } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { pickDatesInsidePeriod } from '@/utils/helpers/pickDaysInsidePeriod';

function ServerDay(
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] },
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;
  const isBeforeNow = day.isBefore(dayjs());
  return (
    <Badge
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      variant={'dot'}
      invisible={!isSelected}
      color={isBeforeNow ? 'error' : 'warning'}
      overlap="circular"
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export const CalendarDayPicker: React.FC = () => {
  const locale = useLocale();

  const {
    taskDates,
    SelectedDate,
    setDay,
    highlightedDays,
    setHighlightedDate,
  } = useSelectedDate();

  useEffect(() => {
    const startOfMonth = dayjs(SelectedDate).startOf('month').toDate();
    const endOfMonth = dayjs(SelectedDate).endOf('month').toDate();
    const daysToHighlight = pickDatesInsidePeriod(
      taskDates,
      startOfMonth,
      endOfMonth,
    ).map((day) => day.getDate());
    setHighlightedDate(daysToHighlight);
  }, [taskDates]);

  const highlightDaysByMonth = useCallback(
    (month: Dayjs) => {
      const startOfMonth = month.startOf('month').toDate();

      const endOfMonth = month.endOf('month').toDate();

      setDay(
        new Date(
          SelectedDate.getFullYear(),
          month.month(),
          SelectedDate.getDate(),
        ),
      );
      const daysToHighlight = pickDatesInsidePeriod(
        taskDates,
        startOfMonth,
        endOfMonth,
      ).map((day) => day.getDate());
      setHighlightedDate(daysToHighlight);
    },
    [taskDates],
  );

  return (
    <LocalizationProvider adapterLocale={locale} dateAdapter={AdapterDayjs}>
      <DateCalendar
        sx={{
          flexShrink: 0,
          backgroundColor: Colors.SECONDARY,
          borderRadius: '20px',
        }}
        value={dayjs(SelectedDate)}
        onChange={(newValue) => setDay!(newValue.toDate())}
        onMonthChange={(month) => highlightDaysByMonth(month)}
        slots={{ day: ServerDay }}
        slotProps={{
          day: {
            highlightedDays,
          } as any,
        }}
      />
    </LocalizationProvider>
  );
};
