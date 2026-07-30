"use client";

import Link from "next/link";
import type { MandateId } from "@/lib/mandates";
import type { UniverseRow } from "@/lib/rows";
import { ScoreBadge } from "./Score";
import { DemonstrationBadge, ProvenanceBadge } from "./Provenance";

/**
 * Side by side comparison.
 *
 * The rows are ordered so that the categorical dimensions, which are directly
 * comparable across public and private companies, come before the financial
 * ones, which are not. Where a figure does not exist for a given market type
 * the cell says so rather than showing an empty space, because an empty cell
 * reads as a small number.
 */

interface Row {
  label: string;
  render: (r: UniverseRow) => React.ReactNode;
  note?: string;
}

const ROWS: Row[] = [
  {
    label: "Technology category",
    render: (r) => (
      <>
        <div>{r.sector}</div>
        <div className="mt-0.5 text-xs text-ink-muted">{r.subsector}</div>
      </>
    ),
  },
  { label: "Business model", render: (r) => r.businessModel },
  { label: "Customer type", render: (r) => r.primaryCustomer },
  {
    label: "Stage",
    render: (r) => (
      <>
        <div>{r.stage}</div>
        <div className="mt-0.5 text-xs text-ink-muted">
          Founded {r.foundedYear}, {r.hq}
        </div>
      </>
    ),
  },
  { label: "Market maturity", render: (r) => r.marketMaturity },
  { label: "Commercial readiness", render: (r) => r.commercialReadiness },
  { label: "Capital intensity", render: (r) => r.capitalIntensity },
  {
    label: "Technical differentiation",
    render: (r) => r.technicalDifferentiation,
  },
  {
    label: "Revenue growth",
    render: (r) => r.revenueGrowth,
    note: "Public companies only. Private companies do not report.",
  },
  {
    label: "Gross margin",
    render: (r) => r.grossMargin,
    note: "Public companies only.",
  },
  {
    label: "Capital raised",
    render: (r) => (
      <>
        <div>{r.capitalRaised}</div>
        {r.marketType === "Private" && (
          <ProvenanceBadge
            provenance={r.capitalRaisedProvenance}
            className="mt-1"
          />
        )}
      </>
    ),
  },
  {
    label: "Cash position or financing need",
    render: (r) => r.cashPosition,
  },
  {
    label: "Valuation",
    render: (r) => (r.marketType === "Public" ? r.marketCap : "Not applicable"),
    note: "Private valuations are not published here. A funding-database figure is not a valuation.",
  },
  {
    label: "Traction signal",
    render: (r) => (
      <>
        <div>{r.tractionSignal}</div>
        <ProvenanceBadge provenance={r.tractionProvenance} className="mt-1" />
      </>
    ),
  },
  { label: "Main risk", render: (r) => r.investmentRisk },
];

export function CompareTable({
  rows,
  mandateId,
  onRemove,
  onClear,
}: {
  rows: UniverseRow[];
  mandateId: MandateId;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold text-ink">
          Comparing {rows.length} of up to 4 companies
        </h3>
        <button type="button" onClick={onClear} className="btn-ghost px-2 py-1">
          Clear comparison
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line-strong">
              <th className="w-48 py-3 pl-4 pr-3 text-left align-bottom font-semibold text-ink">
                Dimension
              </th>
              {rows.map((r) => (
                <th
                  key={r.id}
                  className="py-3 px-3 text-left align-bottom font-semibold text-ink"
                >
                  <Link
                    href={`/universe/${r.id}`}
                    className="hover:text-accent hover:underline"
                  >
                    {r.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="chip">{r.marketType}</span>
                    {r.isDemonstration && <DemonstrationBadge />}
                  </div>
                  <div className="mt-2">
                    <ScoreBadge score={r.scores[mandateId]} showBand={false} />
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(r.id)}
                    className="mt-1 text-xs font-medium text-ink-muted hover:text-accent hover:underline"
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-line align-top">
                <th className="py-3 pl-4 pr-3 text-left font-medium text-ink-soft">
                  {row.label}
                  {row.note && (
                    <span className="mt-0.5 block text-[11px] font-normal leading-relaxed text-ink-muted">
                      {row.note}
                    </span>
                  )}
                </th>
                {rows.map((r) => (
                  <td
                    key={r.id}
                    className="py-3 px-3 text-xs leading-relaxed text-ink-soft"
                  >
                    {row.render(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-line bg-canvas px-4 py-3 text-xs leading-relaxed text-ink-muted">
        Public-company figures are dated analyst estimates expressed as ranges,
        not reported point values. Private-company figures are demonstration
        data on fictional companies. The two are not directly comparable, and
        this table labels which is which rather than presenting them as
        equivalent.
      </p>
    </div>
  );
}
