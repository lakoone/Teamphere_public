import styles from './Widget.module.scss'
import {Paper} from '@mui/material';
import {ReactNode} from 'react';

export type WidgetProps = {
  children: ReactNode
  title?: string

}

export const Widget: React.FC<WidgetProps> = (props: WidgetProps) => {

  return (<Paper sx={{width:'100%'}} className={styles.container}>
    {props.title && <h2>{props.title}</h2>}
    {props.children}
  </Paper>)
}