interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) => {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-10 ${isCenter ? "text-center" : "text-left"} ${className}`}
    >
      {eyebrow && (
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#9A7A46] font-medium mb-3">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl md:text-4xl text-gray-800 font-light font-serif tracking-tight leading-snug">
        {title}
      </h2>

      {/* Ornamental divider */}
      <div
        className={`flex items-center gap-2 mt-4 ${isCenter ? "justify-center" : "justify-start"}`}
      >
        <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#9A7A46]" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#9A7A46]" />
        <div className="h-1 w-1 rounded-full bg-[#9A7A46]/50" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#9A7A46]" />
        <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#9A7A46]" />
      </div>

      {subtitle && (
        <p className="text-sm text-gray-500 mt-4 tracking-wide leading-relaxed max-w-md mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
