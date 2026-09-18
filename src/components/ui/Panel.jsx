import React from 'react';

export function Panel({
  children,
  borderWidth = '2px',
  withShadow = true,
  className = '',
  ...props
}) {
  const borderClass = borderWidth === '2px' ? 'border-2 border-[#1C1B19]' : 'border border-[#1C1B19]/20';
  const shadowClass = withShadow ? 'shadow-[4px_4px_0px_#1C1B19]' : '';

  return (
    <div
      className={`bg-[#F7F5F0] ${borderClass} ${shadowClass} p-6 sm:p-8 lg:p-10 rounded-none transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
