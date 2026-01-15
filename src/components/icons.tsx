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
        <path d="M11.5 7.5C11.5 4.46 9.04 2 6 2S.5 4.46.5 7.5.5 18 6 22c5.5-4 5.5-8.58 0-12.5" />
        <path d="M15.5 7.5c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5-.04 10.5-5.5 14.5c-5.46-4-5.5-8.42 0-12.5" />
        <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        <path d="M16 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        <path d="M8 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
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
