import React from 'react';
import { APP_URL } from '../../config';

export function Button({
  children,
  variant = 'primary', // 'primary' (solid black) | 'outline' (bordered ink) | 'oxblood' (solid oxblood)
  href = APP_URL,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-mono text-xs font-bold uppercase tracking-widest px-5 py-3 transition-colors duration-150 rounded-none cursor-pointer select-none text-center";
  
  let variantStyles = "";
  if (variant === 'primary') {
    variantStyles = "bg-[#1C1B19] text-[#F7F5F0] hover:bg-[#7A1F1F] border border-[#1C1B19]";
  } else if (variant === 'outline') {
    variantStyles = "border border-[#1C1B19] text-[#1C1B19] hover:bg-[#1C1B19] hover:text-[#F7F5F0] bg-transparent";
  } else if (variant === 'oxblood') {
    variantStyles = "bg-[#7A1F1F] text-white hover:bg-[#1C1B19] border border-[#7A1F1F]";
  }

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${variantStyles} ${className}`} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
