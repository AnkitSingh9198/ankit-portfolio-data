import { MaskText } from "./Reveal";

/** Section header: mono index + label, a rule, then a large masked title. */
export function SectionHeader({
  index,
  label,
  title,
  accent,
  id,
  tone = "dark",
  aside,
}: {
  index: string;
  label: string;
  title: string;
  accent?: string;
  id: string;
  tone?: "dark" | "light";
  aside?: React.ReactNode;
}) {
  const muted = tone === "dark" ? "text-muted" : "text-ink/60";
  const rule = tone === "dark" ? "bg-line-strong" : "bg-ink/15";
  return (
    <header className="mb-14 md:mb-20">
      <div className={`label-mono flex items-center gap-4 ${muted}`}>
        <span className={tone === "dark" ? "text-lime" : "text-ink"}>{index}</span>
        <span>{label}</span>
        <span className={`h-px flex-1 ${rule}`} aria-hidden />
        {aside}
      </div>
      <h2 id={`${id}-title`} className="display-lg mt-8 max-w-[18ch] text-balance">
        <MaskText text={title} />
        {accent ? (
          <>
            {" "}
            <MaskText
              text={accent}
              delay={0.15}
              className={`serif-accent font-normal ${tone === "dark" ? "text-lime" : "text-ink"}`}
            />
          </>
        ) : null}
      </h2>
    </header>
  );
}
