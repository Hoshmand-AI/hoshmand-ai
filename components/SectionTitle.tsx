interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center" : "";

  return (
    <div className={alignClass}>
      {eyebrow && (
        <p className="eyebrow mb-3">{eyebrow}</p>
      )}
      <h2 className="text-3xl" style={{ fontFamily: "'DM Serif Display', serif", color: "#0A1628", fontWeight: 400 }}>
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-warm-500 max-w-xl" style={{ color: "#8A8178" }}>
          {description}
        </p>
      )}
    </div>
  );
}
