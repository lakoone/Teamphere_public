import {Button, Popover} from '@mui/material';
import EditCalendarIcon from '@/shared/icons/EditCalendarIcon';
import {CalendarDayPicker} from '@/shared/components/CalendarDayPicker';
import React from 'react';
import {useSelectedDate} from "@/features/calendar/ui/context/CalendarProvider";


interface DatePickerProps {
  ValueHandler: (day:Date)=>void
}


export const DatePicker: React.FC<DatePickerProps> = ({ValueHandler}) => {
  const {SelectedDate} = useSelectedDate()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  React.useEffect(()=>{
    ValueHandler(SelectedDate)
  },[SelectedDate])
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (<><Button
    disableRipple
    color={'inherit'}
    endIcon={<EditCalendarIcon/>}
    onClick={handleClick}>
    {`${SelectedDate.getDate().toString()}/${SelectedDate.getMonth()+1}/${SelectedDate.getFullYear()}`}</Button>
  <Popover
    id={id}
    open={open}
    anchorEl={anchorEl}
    onClose={handleClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
  >
    <CalendarDayPicker />
  </Popover></>)
}