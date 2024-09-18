
import {Chip} from '@mui/material';
import {OverridableStringUnion} from '@mui/types';
import {ChipPropsSizeOverrides} from '@mui/material/Chip/Chip';

export type UserRoleProps = {
  role: string,
  color: string,
  size: OverridableStringUnion<'small' | 'medium', ChipPropsSizeOverrides>,
}

export const UserRole: React.FC<UserRoleProps> = (props: UserRoleProps) => {


  return (<Chip
    size = {props.size}
    label={props.role}
    sx = {{
      borderRadius:'7px',
      color: `${props.color}`,
      '&.MuiChip-label': {
        color: `${props.color}`,
      },
    }}
  />)

}