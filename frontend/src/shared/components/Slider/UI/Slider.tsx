'use client';
import styles from './Slider.module.scss';
import React from 'react';

interface SliderProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  startElement?: number;
  columnWidth: number;
}

export const Slider: React.FC<SliderProps> = (props) => {
  const CalendarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (
      props.startElement !== undefined &&
      props.startElement >= 0 &&
      CalendarRef.current
    ) {
      if (props.startElement !== 0) {
        CalendarRef.current.scrollTo({
          left: props.startElement * props.columnWidth,
        });
      } else {
        CalendarRef.current.scrollTo({
          left: 0,
        });
      }
    }
  }, [props.startElement]);

  return (
    <div
      ref={CalendarRef}
      style={{
        gridAutoColumns: props.columnWidth,
        ...props.style,
      }}
      className={`${styles.container} ${styles.snaps}`}
    >
      {props.children}
    </div>
  );
};
