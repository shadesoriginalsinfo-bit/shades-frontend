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
    <div className={`mb-10 ${isCenter ? "text-center" : "text-left"} ${className}`}>
      {eyebrow && (
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#C6A46C] font-medium mb-3">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl md:text-4xl text-gray-800 font-light font-serif tracking-tight leading-snug">
        {title}
      </h2>

      {/* Ornamental divider */}
      <div className={`flex items-center gap-2 mt-4 ${isCenter ? "justify-center" : "justify-start"}`}>
        <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#C6A46C]" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#C6A46C]" />
        <div className="h-1 w-1 rounded-full bg-[#C6A46C]/50" />
        <div className="h-1.5 w-1.5 rounded-full bg-[#C6A46C]" />
        <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#C6A46C]" />
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