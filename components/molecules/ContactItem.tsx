import { Icon } from "@/components/atoms/Icon";
import type { ContactLink } from "@/lib/types";

type Tone = "dark" | "light";

const tones: Record<Tone, { label: string; value: string; icon: string }> = {
  dark: { label: "text-muted", value: "text-ink", icon: "text-brand" },
  light: { label: "text-white/70", value: "text-white", icon: "text-sun" },
};

type ContactItemProps = { link: ContactLink; tone?: Tone };

export function ContactItem({ link, tone = "dark" }: ContactItemProps) {
  const { icon, label, value, href, external } = link;
  const t = tones[tone];
  return (
    <div className="flex items-start gap-3">
      <Icon name={icon} className={`mt-1 size-6 shrink-0 ${t.icon}`} />
      <div>
        <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${t.label}`}>
          {label}
        </p>
        {href ? (
          <a
            href={href}
            {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            className={`text-lg hover:underline ${t.value}`}
          >
            {value}
          </a>
        ) : (
          <p className={`text-lg ${t.value}`}>{value}</p>
        )}
      </div>
    </div>
  );
}
