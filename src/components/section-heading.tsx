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
    <div className={cn("space-y-3", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase text-emerald-300">
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "max-w-3xl text-3xl font-bold text-white md:text-4xl",
          titleClassName
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
