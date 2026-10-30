import { Link } from "@/components/atoms/Link";

const base = "rounded-full px-4 py-2 text-sm font-semibold transition-colors";
const active = "bg-brand text-white";
const idle = "border border-line bg-white hover:border-ink/30";

type PaginationProps = {
  page: number;
  totalPages: number;
  href: (page: number) => string;
};

export function Pagination({ page, totalPages, href }: PaginationProps) {
  if (totalPages <= 1) return null;
  const numbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav aria-label="Paginación">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {page > 1 && (
          <li>
            <Link href={href(page - 1)} rel="prev" className={`block ${base} ${idle}`}>
              Anteriores
            </Link>
          </li>
        )}
        {numbers.map((number) => (
          <li key={number}>
            <Link
              href={href(number)}
              aria-current={number === page ? "page" : undefined}
              className={`block ${base} ${number === page ? active : idle}`}
            >
              {number}
            </Link>
          </li>
        ))}
        {page < totalPages && (
          <li>
            <Link href={href(page + 1)} rel="next" className={`block ${base} ${idle}`}>
              Siguientes
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
