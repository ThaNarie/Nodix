import { SVGProps } from 'react';
import { cn } from '@/lib/utils';

type NodixLogoProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

function NodixLogo({ className, ...props }: NodixLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('size-6', className)}
      {...props}
    >
      {/* Main circular nodes */}
      <circle cx="6" cy="6" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="6" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="6" cy="18" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18" r="2.5" fill="currentColor" stroke="none" />

      {/* Center node */}
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />

      {/* Connection lines */}
      <path d="M8 6L10 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 6L14 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 18L10 12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 18L14 12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export { NodixLogo };
