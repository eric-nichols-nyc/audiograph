import React from "react";

interface HeadphonesLoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export const HeadphonesLoader: React.FC<HeadphonesLoaderProps> = ({
  size = 120,
  color = "#3b82f6",
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Sound wave circles */}
        <circle
          className="animate-[pulse_2s_ease-in-out_infinite] opacity-30 origin-center"
          cx="60"
          cy="60"
          r="40"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <circle
          className="animate-[pulse_2s_ease-in-out_0.5s_infinite] opacity-20 origin-center"
          cx="60"
          cy="60"
          r="50"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />

        {/* Headphone band */}
        <path
          d="M30 65C30 45 40 30 60 30C80 30 90 45 90 65"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left earpiece */}
        <g className="animate-[bobLeft_2.5s_ease-in-out_infinite]">
          <rect x="20" y="65" width="18" height="25" rx="5" fill={color} />
          <rect x="15" y="70" width="5" height="15" rx="2" fill={color} />
          <rect
            x="22"
            y="70"
            width="14"
            height="15"
            rx="2"
            fill="#000"
            fillOpacity="0.2"
          />
          <circle
            className="animate-[pulsate_1.2s_ease-in-out_infinite]"
            cx="33"
            cy="78"
            r="3"
            fill="white"
          />
        </g>

        {/* Right earpiece */}
        <g className="animate-[bobRight_2.5s_ease-in-out_0.2s_infinite]">
          <rect x="82" y="65" width="18" height="25" rx="5" fill={color} />
          <rect x="100" y="70" width="5" height="15" rx="2" fill={color} />
          <rect
            x="84"
            y="70"
            width="14"
            height="15"
            rx="2"
            fill="#000"
            fillOpacity="0.2"
          />
          <circle
            className="animate-[pulsate_1.2s_ease-in-out_0.3s_infinite]"
            cx="87"
            cy="78"
            r="3"
            fill="white"
          />
        </g>

        {/* Loading dots */}
        <circle
          className="animate-[fade_1.5s_ease-in-out_infinite]"
          cx="50"
          cy="100"
          r="3"
          fill={color}
        />
        <circle
          className="animate-[fade_1.5s_ease-in-out_0.3s_infinite]"
          cx="60"
          cy="100"
          r="3"
          fill={color}
        />
        <circle
          className="animate-[fade_1.5s_ease-in-out_0.6s_infinite]"
          cx="70"
          cy="100"
          r="3"
          fill={color}
        />
      </svg>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes bobLeft {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-1px, -2px);
          }
          75% {
            transform: translate(1px, 2px);
          }
        }

        @keyframes bobRight {
          0%,
          100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(1px, 2px);
          }
          75% {
            transform: translate(-1px, -2px);
          }
        }

        @keyframes pulsate {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes fade {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
