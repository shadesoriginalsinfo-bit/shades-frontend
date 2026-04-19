export const CornerOrnament = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M2 2 L2 40" stroke="#9A7A46" strokeWidth="1" opacity="0.6" />
    <path d="M2 2 L40 2" stroke="#9A7A46" strokeWidth="1" opacity="0.6" />
    <path d="M2 2 L18 18" stroke="#9A7A46" strokeWidth="0.5" opacity="0.4" />
    <circle cx="2" cy="2" r="2.5" fill="#9A7A46" opacity="0.7" />
    <circle
      cx="2"
      cy="2"
      r="6"
      stroke="#9A7A46"
      strokeWidth="0.5"
      opacity="0.3"
      fill="none"
    />
  </svg>
);

export const GoldDivider = () => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#9A7A46]/40" />
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
      <path
        d="M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z"
        fill="#9A7A46"
        opacity="0.7"
      />
    </svg>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#9A7A46]/40" />
  </div>
);

export const GoldPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="goldGrid"
        width="48"
        height="48"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="24" cy="24" r="0.8" fill="#9A7A46" opacity="0.15" />
        <path
          d="M0 24 H48 M24 0 V48"
          stroke="#9A7A46"
          strokeWidth="0.3"
          opacity="0.07"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#goldGrid)" />
  </svg>
);
