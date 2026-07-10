import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
};

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  className,
  titleClassName,
}: SectionHeadingProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {eyebrow ? (
        <p className="font-technical flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400">
          <span className="h-px w-6 bg-orange-400" aria-hidden="true" />
          <span>{eyebrow}</span>
        </p>
      ) : null}
      <h1
        className={cn(
          "max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white md:text-6xl",
          titleClassName
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-2xl text-base leading-7 text-zinc-400 md:text-lg md:leading-8">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
