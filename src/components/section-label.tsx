type SectionLabelProps = {
  index: string;
  title: string;
};

// A schematic eyebrow used across sections: §NN + tick + label. Gives the page
// a consistent "instrument" identity without decoration for its own sake.
export function SectionLabel({ index, title }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
      <span className="text-accent">§{index}</span>
      <span className="h-px w-8 bg-line" aria-hidden />
      <span className="text-text-muted">{title}</span>
    </div>
  );
}
