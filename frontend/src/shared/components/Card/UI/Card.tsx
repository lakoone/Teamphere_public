import styles from './Card.module.scss';
import React, { ReactNode } from 'react';

export type CardProps = {
  children: ReactNode;
  margin?: string;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    return (
      <div
        style={{ margin: props.margin }}
        ref={ref}
        className={styles.container}
        tabIndex={-1}
      >
        {props.children}
      </div>
    );
  },
);
