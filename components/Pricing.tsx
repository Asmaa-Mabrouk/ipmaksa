import { Markdown } from "@/lib/markdown";

type Tier = { name: string; note: string; amount: string; unit: string };
type Block = { kind: "md"; text: string } | { kind: "tiers"; title: string; tiers: Tier[] };

const ITEM = /^[-*]\s+\*\*(.+?):?\*\*:?\s*(.+)$/;

/** Splits the membership markdown into pricing groups (cards) and ordinary text. */
export function parsePricing(source: string): Block[] {
  const parts = source.split(/\n(?=## )/);
  return parts.map((raw): Block => {
    const lines = raw.trim().split("\n");
    const heading = lines[0].startsWith("## ") ? lines.shift()!.slice(3).trim() : "";
    const body = lines.filter((l) => l.trim());
    const items = body.map((l) => l.trim().match(ITEM));
    if (heading && body.length && items.every((m) => m && /\d/.test(m[2]))) {
      const tiers = items.map((m) => {
        const label = m![1].trim();
        const cut = label.search(/[,،(]/);
        const name = (cut > 0 ? label.slice(0, cut) : label).trim();
        const note = cut > 0 ? label.slice(cut).replace(/^[,،]\s*/, "").replace(/^\((.*)\)$/, "$1").trim() : "";
        const val = m![2].trim();
        const num = val.match(/[\d][\d,.]*/);
        const amount = num ? num[0] : val;
        const unit = num ? val.replace(num[0], "").trim() : "";
        return { name, note, amount, unit };
      });
      return { kind: "tiers", title: heading, tiers };
    }
    return { kind: "md", text: raw };
  });
}

function TierGroup({ b, perYearLabel }: { b: Extract<Block, { kind: "tiers" }>; perYearLabel: string }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-green-900">{b.title}</h2>
      <ul className={`mt-5 grid gap-4 sm:grid-cols-2 ${b.tiers.length === 4 ? "" : "lg:grid-cols-3"}`}>
        {b.tiers.map((t) => (
          <li key={t.name} className="flex flex-col overflow-hidden rounded-2xl border border-green-900/10 bg-white shadow-sm">
            <div className="flex-1 px-5 pb-3 pt-4">
              <h3 className="text-lg font-extrabold leading-snug text-green-900">{t.name}</h3>
              <p className="mt-1 text-sm text-ink/70">{t.note}</p>
            </div>
            <div className="border-t-4 border-gold-500 bg-green-50/60 px-4 py-4">
              <p dir="ltr" className="flex flex-wrap items-baseline gap-x-2 text-green-900 rtl:justify-end">
                <span className="text-3xl font-extrabold tabular-nums">{t.amount}</span>
                <span className="font-bold text-gold-600">{t.unit}</span>
              </p>
              <p className="mt-0.5 text-xs text-ink/60">{perYearLabel}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PricingBlocks({ source, perYearLabel }: { source: string; perYearLabel: string }) {
  const blocks = parsePricing(source);
  // consecutive pricing groups sit side by side on large screens
  const rows: Block[][] = [];
  for (const b of blocks) {
    const last = rows[rows.length - 1];
    if (b.kind === "tiers" && last && last[0].kind === "tiers") last.push(b);
    else rows.push([b]);
  }
  return (
    <div className="space-y-12">
      {rows.map((row, i) =>
        row[0].kind === "md" ? (
          <div key={i} className="max-w-3xl"><Markdown source={row[0].text} /></div>
        ) : (
          <div key={i} className="grid items-start gap-10 lg:grid-cols-2 lg:gap-8">
            {row.map((b, k) => b.kind === "tiers" && <TierGroup key={k} b={b} perYearLabel={perYearLabel} />)}
          </div>
        ),
      )}
    </div>
  );
}
