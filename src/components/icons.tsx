import { cn } from "@/lib/utils";
import * as React from 'react';

export const PawsightLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 12a3 3 0 1 0-3-3" />
        <path d="M18 12a3 3 0 1 0-3-3" />
        <path d="M12 12a3 3 0 1 0 3 3" />
        <path d="M6 12a3 3 0 1 0 3 3" />
        <path d="M12 2a10 10 0 0 0-3.5 19.3" />
        <path d="M15.5 21.3a10 10 0 0 0 0-18.6" />
    </svg>
);


export const DogTailAnimation = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg 
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <style>{`
        @keyframes wag {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(25deg); }
        }
        .wagging-tail {
          transform-origin: 3px 19px;
          animation: wag 0.5s ease-in-out infinite;
        }
      `}</style>
      <path className="wagging-tail" d="M3 19s2-3 4-3 3 3 3 3" />
    </svg>
  );
};
