/**
 * The mark: three stacked layers of a value chain, with the middle layer
 * highlighted. The platform's central argument is that the constraint, and
 * therefore the margin, moves between layers over time.
 */
export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Venture Investment Research Engine"
    >
      <rect width="32" height="32" rx="7" fill="#0f1216" />
      <rect x="7" y="8" width="18" height="3.6" rx="1.2" fill="#ffffff" />
      <rect x="7" y="14.2" width="18" height="3.6" rx="1.2" fill="#1a56db" />
      <rect
        x="7"
        y="20.4"
        width="18"
        height="3.6"
        rx="1.2"
        fill="#ffffff"
        opacity="0.45"
      />
    </svg>
  );
}
