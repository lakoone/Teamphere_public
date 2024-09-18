import styles from './Header.module.scss';
import { CSSProperties } from 'react';

interface HeaderProps {
  style?: CSSProperties;
  height?: string;
  children: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <header
      className={styles.header}
      style={{
        ...props.style,
        height: props.height,
      }}
    >
      {props.children}
    </header>
  );
};
