const LabelField = ({
  label,
  children,
  span2,
}: {
  label: string;
  children: React.ReactNode;
  span2?: boolean;
}) => (
  <div className={`space-y-1 ${span2 ? "md:col-span-2" : ""}`}>
    <label className="text-[10px] tracking-[0.25em] uppercase text-[#9A7A46] font-semibold">
      {label}
    </label>
    {children}
  </div>
);

export default LabelField;
