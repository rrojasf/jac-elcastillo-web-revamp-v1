import Image from "next/image";
import { SITE } from "@/lib/site";

type Tone = "dark" | "light";

const tones: Record<Tone, { place: string; name: string }> = {
  dark: { place: "text-muted", name: "text-ink" },
  light: { place: "text-white/70", name: "text-white" },
};

type LogoProps = { tone?: Tone; className?: string };

export function Logo({ tone = "dark", className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      <Image src={SITE.logo} alt="" width={44} height={44} />
      <span className="flex flex-col gap-1">
        <span
          className={`text-xs font-semibold uppercase tracking-[0.14em] ${tones[tone].place}`}
        >
          {SITE.place}
        </span>
        <span
          className={`font-display text-xl font-extrabold leading-none ${tones[tone].name}`}
        >
          {SITE.name}
        </span>
      </span>
    </span>
  );
}
