import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 32, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Circle Ring */}
      <circle cx="50" cy="50" r="48" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      
      {/* Side Dots */}
      <circle cx="4" cy="50" r="2.5" fill="#10b981" />
      <circle cx="96" cy="50" r="2.5" fill="#10b981" />

      {/* Path for text */}
      <defs>
        <path id="textPathTop" d="M 20, 50 a 30, 30 0 0, 1 60, 0" />
        <path id="textPathBottom" d="M 20, 50 a 30, 30 0 0, 0 60, 0" />
      </defs>

      {/* Circular Text */}
      <text fill="#059669" fontSize="7" fontWeight="900" letterSpacing="1.5" className="select-none uppercase">
        <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">SAAFASewa</textPath>
      </text>
      <text fill="#059669" fontSize="7" fontWeight="900" letterSpacing="1.5" className="select-none uppercase">
        <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">SAAFASewa</textPath>
      </text>

      {/* Inner Circle Border */}
      <circle cx="50" cy="50" r="28" stroke="#10b981" strokeWidth="1.5" fill="white" className="shadow-sm" />

      {/* Globe */}
      <circle cx="50" cy="46" r="16" fill="#38bdf8" />
      <path
        d="M50 30C43 30 37 32.5 34 37C32.5 39 32 41.5 32 44C32 48.5 34 52.5 37.5 55C39 49 43 44.5 48 42C53 44.5 57 49 58.5 55C62 52.5 64 48.5 64 44C64 41.5 63.5 39 62 37C59 32.5 53 30 46.5 30H50Z"
        fill="#10b981"
      />

      {/* Leaves */}
      <path
        d="M50 72C50 72 35 65 31 52C39 56 46 67 50 72Z"
        fill="#059669"
        stroke="#064e3b"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M50 72C50 72 65 65 69 52C61 56 54 67 50 72Z"
        fill="#10b981"
        stroke="#064e3b"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      
      {/* Stem/Center line of leaves */}
      <path d="M50 64V72" stroke="#064e3b" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;
