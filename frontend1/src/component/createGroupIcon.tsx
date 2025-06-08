import React from 'react';

const CreateGroupIcon = ({ size = 24, color = 'currentColor',  }) => (
  <svg

    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
    width={size}
    height={size}
    className="cursor-pointer"
  >
    {/* Group (people) */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a4 4 0 00-4-4h-1m-8 6h5v-2a4 4 0 00-4-4H7m6-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z"
    />
    {/* Plus sign */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v8m4-4H8"
    />
  </svg>
);

export default CreateGroupIcon;
