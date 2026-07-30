import Link from "next/link";
import { rowsForIds } from "@/lib/rows";
import { SIGNAL_BY_ID } from "@/lib/data/market-signals";

/**
 * The value chain map.
 *
 * Rendered as a stack of layers rather than a horizontal flow, because the
 * useful question is which layer captures margin, not which step happens
 * first. Private companies link into the sourcing universe. Public companies
 * appear as market signals only and are labelled as such.
 */
export function ValueChain({
  layers,
}: {
  layers: readonly {
    layer: string;
    constraint: string;
    whoCaptures: string;
    publicSignalIds: readonly string[];
    privateIds: readonly string[];
  }[];
}) {
  return (
    <ol className="space-y-3">
      {layers.map((layer, i) => {
        const privateRows = rowsForIds(layer.privateIds);
        return (
          <li key={layer.layer} className="card overflow-hidden">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
              <div className="flex shrink-0 items-start gap-3 sm:w-52">
                <span className="mt-0.5 font-mono text-xs font-semibold text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-semibold text-ink">{layer.layer}</h3>
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm leading-relaxed text-ink-soft">
                  <span className="font-medium text-ink">Constraint. </span>
                  {layer.constraint}
                </p>
                <p className="rounded-lg border border-accent-line bg-accent-soft px-3 py-2 text-xs leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">
                    Margin capture.{" "}
                  </span>
                  {layer.whoCaptures}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="label">Private sourcing candidates</p>
                    <div className="flex flex-wrap gap-1.5">
                      {privateRows.length > 0 ? (
                        privateRows.map((c) => (
                          <Link
                            key={c.id}
                            href={`/universe/${c.id}`}
                            className="chip hover:border-accent hover:text-accent"
                          >
                            {c.name}
                          </Link>
                        ))
                      ) : (
                        <span className="text-xs text-ink-muted">
                          None tracked at this layer
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="label">Public market signals</p>
                    <div className="flex flex-wrap gap-1.5">
                      {layer.publicSignalIds.length > 0 ? (
                        layer.publicSignalIds.map((id) => {
                          const s = SIGNAL_BY_ID[id];
                          if (!s) return null;
                          return (
                            <Link
                              key={id}
                              href="/market-signals"
                              className="chip hover:border-accent hover:text-accent"
                              title="Public company, market signal only. Not a sourcing candidate."
                            >
                              {s.name} ({s.ticker})
                            </Link>
                          );
                        })
                      ) : (
                        <span className="text-xs text-ink-muted">
                          None tracked at this layer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
