/** The X-signal mark: an X glyph with a single fired signal dot. */
export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="X Sourcing Engine"
    >
      <rect width="32" height="32" rx="7" fill="#0f1216" />
      <path
        d="M9 9 L21 21"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M21 9 L9 21"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle
        cx="24.5"
        cy="8"
        r="3.5"
        fill="#1a56db"
        stroke="#0f1216"
        strokeWidth="1.6"
      />
    </svg>
  );
}
