import styles from './Line.module.scss';

export type LineProps = {
  isVertical?: boolean;
};

export const Line: React.FC<LineProps> = ({ isVertical = false }) => {
  return (
    <div
      className={`${isVertical ? styles.vertical : styles.horizontal}`}
    ></div>
  );
};
