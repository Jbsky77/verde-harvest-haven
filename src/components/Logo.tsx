
import React from 'react';

interface LogoProps {
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ collapsed }) => {
  return (
    <div className="px-4 py-3">
      {collapsed ? (
        <span className="text-xl font-bold text-primary">GP</span>
      ) : (
        <span className="text-xl font-bold text-primary">GreenPulse</span>
      )}
    </div>
  );
};
