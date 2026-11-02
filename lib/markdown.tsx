import type { ReactNode } from "react";

/**
 * Tiny, safe Markdown renderer for editor-written content.
 * Supports: ## / ### headings, - lists, 1. lists, paragraphs, **bold**, *italic*, [text](url).
 * Everything is rendered as React nodes, so nothing is ever injected as raw HTML.
 */
const SAFE = /^(https?:\/\/|mailto:|tel:|\/)/i;

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const href = SAFE.test(m[2]) ? m[2] : "#";
      const external = /^https?:/i.test(href);
      out.push(
        <a key={`${key}-${i++}`} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {m[1]}
        </a>,
      );
    } else if (m[3] !== undefined) out.push(<strong key={`${key}-${i++}`}>{m[3]}</strong>);
    else if (m[4] !== undefined) out.push(<em key={`${key}-${i++}`}>{m[4]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source, className = "" }: { source: string; className?: string }) {
  const lines = (source || "").replace(/\r/g, "").split("\n");
  const nodes: ReactNode[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let k = 0;

  const flushPara = () => {
    if (para.length) {
      nodes.push(<p key={k++}>{inline(para.join(" "), `p${k}`)}</p>);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      const items = list.items.map((it, i) => <li key={i}>{inline(it, `l${k}-${i}`)}</li>);
      nodes.push(list.ordered ? <ol key={k++}>{items}</ol> : <ul key={k++}>{items}</ul>);
      list = null;
    }
  };

  let table: string[][] | null = null;
  const flushTable = () => {
    if (!table) return;
    const [head, ...body] = table;
    nodes.push(
      <div key={k++} className="overflow-x-auto">
        <table>
          <thead><tr>{head.map((c, i) => <th key={i}>{inline(c, `th${k}-${i}`)}</th>)}</tr></thead>
          <tbody>{body.map((r, ri) => <tr key={ri}>{r.map((c, i) => <td key={i}>{inline(c, `td${k}-${ri}-${i}`)}</td>)}</tr>)}</tbody>
        </table>
      </div>,
    );
    table = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    let m: RegExpMatchArray | null;
    if (line.trim().startsWith("|")) {
      flushPara();
      flushList();
      const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue; // separator row
      (table ??= []).push(cells);
      continue;
    }
    flushTable();
    if (!line.trim()) {
      flushPara();
      flushList();
    } else if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
      flushPara();
      flushList();
      nodes.push(m[1].length === 2 ? <h2 key={k++}>{inline(m[2], `h${k}`)}</h2> : <h3 key={k++}>{inline(m[2], `h${k}`)}</h3>);
    } else if ((m = line.match(/^[-*]\s+(.*)$/))) {
      flushPara();
      if (!list || list.ordered) { flushList(); list = { ordered: false, items: [] }; }
      list.items.push(m[1]);
    } else if ((m = line.match(/^\d+\.\s+(.*)$/))) {
      flushPara();
      if (!list || !list.ordered) { flushList(); list = { ordered: true, items: [] }; }
      list.items.push(m[1]);
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  flushTable();
  return <div className={`prose-ipma ${className}`}>{nodes}</div>;
}
