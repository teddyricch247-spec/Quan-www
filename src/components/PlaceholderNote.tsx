import React from 'react';
import { Info } from 'lucide-react';

export interface PlaceholderNoteProps {
  /** e.g. "Placeholder" or "Fill in" — matches the spec's own wording. */
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Renders the spec's explicit "don't ship invented numbers/claims"
 * flags (benchmarks, screenshots, differentiation copy) as a visible
 * editorial note rather than fabricated content — see spec §Part 4,
 * "Still needs real content before shipping."
 */
export const PlaceholderNote: React.FC<PlaceholderNoteProps> = ({ label, children, className = '' }) => {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-warning-border bg-warning-soft px-5 py-4 text-[0.9375rem] leading-[1.6] text-warning ${className}`}
    >
      <Info className="mt-0.5 h-[18px] w-[18px] flex-none" strokeWidth={1.8} />
      <p className="m-0">
        <strong className="font-semibold">{label}:</strong> {children}
      </p>
    </div>
  );
};

export default PlaceholderNote;
