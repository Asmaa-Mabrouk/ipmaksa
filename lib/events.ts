import type { ProjectEventDoc } from "@/lib/content/types";

const RIYADH = "+03:00"; // Saudi Arabia has no daylight saving

/** "8:00 PM", "20:00" -> "20:00" */
function to24(h: string, m: string, ap?: string) {
  let hh = parseInt(h, 10);
  if (ap) {
    const pm = /p/i.test(ap);
    if (pm && hh < 12) hh += 12;
    if (!pm && hh === 12) hh = 0;
  }
  return `${String(hh).padStart(2, "0")}:${m}`;
}

/** End time as HH:MM. Uses the explicit field, else the last time found in the free-text "time". */
export function endClock(e: Pick<ProjectEventDoc, "time" | "endTime">): string | null {
  if (e.endTime && /^\d{1,2}:\d{2}$/.test(e.endTime.trim())) {
    const [h, m] = e.endTime.trim().split(":");
    return to24(h, m);
  }
  const all = [...(e.time || "").matchAll(/(\d{1,2}):(\d{2})\s*([ap]m)?/gi)];
  const last = all[all.length - 1];
  return last ? to24(last[1], last[2], last[3]) : null;
}

/** True once the session has finished (Asia/Riyadh). With no end time, the event ends at the end of its day. */
export function eventEnded(e: Pick<ProjectEventDoc, "date" | "time" | "endTime">, now = Date.now()): boolean {
  if (!e.date) return false;
  const end = endClock(e);
  const at = Date.parse(end ? `${e.date}T${end}:00${RIYADH}` : `${e.date}T23:59:59${RIYADH}`);
  return Number.isFinite(at) && at < now;
}

/** A registration link must open one named webinar, not the provider's generic page. */
export function validRegistrationLink(link: string): boolean {
  if (!link) return false;
  try {
    const u = new URL(link);
    if (!/^https?:$/.test(u.protocol)) return false;
    const segs = u.pathname.split("/").filter(Boolean);
    if (!segs.length) return false;
    if (/(^|\.)zoom\.(us|com)$/.test(u.hostname)) {
      // zoom.us/webinar/register without an id is the "Invalid meeting ID" page
      return segs.length > 2 || (segs.length === 2 && !["register", "webinar", "meeting"].includes(segs[1]) && segs[0] === "j");
    }
    return segs[segs.length - 1].toLowerCase() !== "register";
  } catch {
    return false;
  }
}
