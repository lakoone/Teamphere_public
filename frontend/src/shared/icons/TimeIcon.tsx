import React from 'react';

interface IconProps {
  color?: string;
}
const TimeIcon: React.FC<IconProps> = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill={color || '#858585'}
        /* eslint-disable-next-line max-len */
        d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12S6.07 1.25 12 1.25 22.75 6.07 22.75 12 17.93 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"
      ></path>
      <path
        fill={color || '#858585'}
        /* eslint-disable-next-line max-len */
        d="M15.71 15.93a.67.67 0 01-.38-.11l-3.1-1.85c-.77-.46-1.34-1.47-1.34-2.36v-4.1c0-.41.34-.75.75-.75s.75.34.75.75v4.1c0 .36.3.89.61 1.07l3.1 1.85c.36.21.47.67.26 1.03a.77.77 0 01-.65.37z"
      ></path>
    </svg>
  );
};

export default TimeIcon;
