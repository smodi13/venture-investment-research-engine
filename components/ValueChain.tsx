import Link from "next/link";
import { rowsForIds } from "@/lib/rows";

/**
 * The value chain map.
 *
 * Rendered as a stack of layers rather than as a horizontal flow, because the
 * useful question in these sectors is which layer captures margin, not which
 * step happens first. Companies from the universe are attached to the layer
 * they operate at, so the map doubles as a navigation surface.
 */
export function ValueChain({
  layers,
}: {
  layers: readonly {
    name: string;
    description: string;
    marginPosition: string;
    companyIds: readonly string[];
  }[];
}) {
  return (
    <ol className="space-y-3">
      {layers.map((layer, i) => {
        const companies = rowsForIds(layer.companyIds);
        return (
          <li key={layer.name} className="card overflow-hidden">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
              <div className="flex shrink-0 items-start gap-3 sm:w-56">
                <span className="mt-0.5 font-mono text-xs font-semibold text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-semibold text-ink">{layer.name}</h3>
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm leading-relaxed text-ink-soft">
                  {layer.description}
                </p>
                <p className="rounded-lg border border-accent-line bg-accent-soft px-3 py-2 text-xs leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">
                    Margin position.{" "}
                  </span>
                  {layer.marginPosition}
                </p>
                {companies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {companies.map((c) => (
                      <Link
                        key={c.id}
                        href={`/universe/${c.id}`}
                        className="chip hover:border-accent hover:text-accent"
                      >
                        {c.name}
                        {c.isDemonstration && (
                          <span className="ml-1 text-ink-muted">
                            (demonstration)
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
