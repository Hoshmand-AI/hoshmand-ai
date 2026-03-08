interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 24, className = "" }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <circle cx="16" cy="16" r="4" fill="#9B8FD4" />
      <defs>
        <linearGradient
          id="logoGradient"
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6B5FB4" stopOpacity="0.6" />
          <stop offset="0.5" stopColor="#8B7FD4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#6B5FB4" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface LogoFullProps {
  iconSize?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function LogoFull({
  iconSize = 24,
  className = "",
  showText = true,
  textClassName = "",
}: LogoFullProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={iconSize} />
      {showText && (
        <span
          className={`text-base font-semibold tracking-tight text-white ${textClassName}`}
        >
          Hoshmand AI
        </span>
      )}
    </div>
  );
}

export default LogoIcon;
