/**
 * Overwrite selected database documents with the starter content in lib/content/seed*.ts.
 *
 *   DATABASE_URL=... npx tsx scripts/sync-seed.ts                      # lists what differs (dry run)
 *   DATABASE_URL=... npx tsx scripts/sync-seed.ts --apply pages        # overwrite every differing page
 *   DATABASE_URL=... npx tsx scripts/sync-seed.ts --apply pages:membership pages:recertification
 *
 * Anything edited in the admin panel for those documents is replaced by the seed text.
 */
import { Pool } from "pg";
import { SEED } from "../lib/content/seed";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Set DATABASE_URL first.");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const targets = args.filter((a) => !a.startsWith("--"));
const ssl = /sslmode=require|ssl=true/.test(url) ? { rejectUnauthorized: false } : undefined;
const pool = new Pool({ connectionString: url, ssl });

(async () => {
  let changed = 0;
  for (const [col, docs] of Object.entries(SEED)) {
    for (const [id, data] of Object.entries(docs as Record<string, unknown>)) {
      const key = `${col}:${id}`;
      if (targets.length && !targets.some((t) => t === col || t === key)) continue;
      const { rows } = await pool.query("SELECT data FROM documents WHERE collection=$1 AND id=$2", [col, id]);
      if (!rows.length) {
        // Missing document: add it only when the collection already lives in the database,
        // otherwise the site is still showing the seed and will pick the new document up itself.
        const n = await pool.query("SELECT 1 FROM documents WHERE collection=$1 LIMIT 1", [col]);
        if (!n.rowCount) continue;
        changed++;
        console.log(`${apply ? "adding  " : "missing "} ${key}`);
        if (apply) await pool.query("INSERT INTO documents (collection, id, data) VALUES ($1,$2,$3)", [col, id, JSON.stringify(data)]);
        continue;
      }
      if (JSON.stringify(rows[0].data) === JSON.stringify(data)) continue;
      changed++;
      console.log(`${apply ? "updating" : "differs "} ${key}`);
      if (apply) await pool.query("UPDATE documents SET data=$3, updated_at=now() WHERE collection=$1 AND id=$2", [col, id, JSON.stringify(data)]);
    }
  }
  console.log(changed ? (apply ? `${changed} document(s) updated.` : `${changed} differ. Re-run with --apply and the ids to overwrite.`) : "Everything already matches the seed.");
  await pool.end();
})();
