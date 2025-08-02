import React from 'react';
import { getInitials } from '../../utils/helper';

const CharAvatar = ({ fullName = '', width = 'w-12', height = 'h-12', style = '' }) => {
  const initials = getInitials(fullName);

  return (
    <div
      className={`${width} ${height} ${style} flex items-center justify-center rounded-full text-gray-900 font-medium bg-gray-200`}
      aria-label={`Avatar for ${fullName}`}
      title={fullName}
    >
      {initials}
    </div>
  );
};

export default CharAvatar;
