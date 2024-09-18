
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
    size = {'medium'}
    label={props.role}
    sx = {{
      color: props.color,
      '&.MuiChip-label': {
        color: props.color,
      },
    }}
  />)

}