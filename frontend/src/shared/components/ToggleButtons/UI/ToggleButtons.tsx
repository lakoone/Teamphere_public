import {ToggleButton, ToggleButtonGroup} from '@mui/material';
import React from 'react';

type Option = {
  value: string
  title: string
}
type ToggleButtonsProps = {
  Options: Option[],
  defaultValue: string,
  onChange: (mode:string)=>void

}

export const ToggleButtons: React.FC<ToggleButtonsProps> = (props: ToggleButtonsProps) => {
  const [alignment, setAlignment] = React.useState(props.defaultValue);

  return (<ToggleButtonGroup

    value={alignment}
    exclusive={true}
    onChange={(_event: React.MouseEvent<HTMLElement>,
      newAlignment: string,)=>{
      if(newAlignment!==null){
        props.onChange(newAlignment)
        setAlignment(newAlignment);
      }
    }}
    aria-label="Platform"
  >
    {props.Options.map((option)=>
      <ToggleButton disableRipple key={option.title} value={option.value}>{option.title}</ToggleButton>
    )}
  </ToggleButtonGroup>)
}