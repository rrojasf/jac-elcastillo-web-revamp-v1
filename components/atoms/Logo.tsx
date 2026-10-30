import Image from "next/image";
import mark from "@/public/brand/cropped-favicon.webp";
import { SITE } from "@/lib/site";

type Tone = "dark" | "light";

const tones: Record<Tone, { text: string; tagline: string }> = {
  dark: { text: "text-ink", tagline: "text-muted" },
  light: { text: "text-white", tagline: "text-white/70" },
};

type LogoProps = { tone?: Tone; className?: string };

export function Logo({ tone = "dark", className = "" }: LogoProps) {
  return (
    <span className={`flex items-center gap-2 lg:gap-3 ${className}`.trim()}>
      <Image
        src={mark}
        alt=""
        width={71}
        height={71}
        className="size-13 shrink-0 sm:size-16 lg:size-[71px]"
      />
      <span
        className={`flex flex-col gap-0.5 whitespace-nowrap leading-none ${tones[tone].text}`}
      >
        <span className="text-xs/none font-medium [font-variant-caps:small-caps] lg:text-sm/none">
          {SITE.org}
        </span>
        <span className="block h-1 bg-sun" />
        <span className="font-display text-xs/none font-bold uppercase lg:text-sm/none">
          {SITE.place}
        </span>
        <span className="font-display text-xs/none font-extrabold uppercase tracking-[0.3em] lg:text-sm/none lg:tracking-[0.4em]">
          {SITE.locality}
        </span>
        <span className="flex flex-col">
          <span className="block h-0.5 bg-flag-blue" />
          <span className="block h-0.5 bg-flag-red" />
        </span>
        <span className={`hidden text-[10px] sm:block lg:text-[11px] ${tones[tone].tagline}`}>
          “{SITE.tagline}”
        </span>
      </span>
    </span>
  );
}
