import { NextRequest, NextResponse } from "next/server";

// Use nodejs runtime — edge runtime strips cookies from upstream responses
export const runtime = "nodejs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

// Every upstream call gets its own short timeout so a slow/dead source can
// never stall the whole response — the route always resolves quickly with
// whatever real data it managed to gather.
const SOURCE_TIMEOUT_MS = 5000;
const withTimeout = (ms: number) => AbortSignal.timeout(ms);

interface ProfileStats {
  easySolved: number; totalEasy: number;
  mediumSolved: number; totalMedium: number;
  hardSolved: number; totalHard: number;
  totalSolved: number; ranking: number;
}
interface CalDay { date: number; count: number }
interface Result { days: CalDay[] | null; profile: ProfileStats | null }

function parseDays(calStr: unknown): CalDay[] | null {
  try {
    const obj: Record<string, number> =
      typeof calStr === "string" ? JSON.parse(calStr) : (calStr as Record<string, number>);
    const days = Object.entries(obj).map(([ts, cnt]) => ({ date: Number(ts), count: Number(cnt) }));
    return days.length > 0 ? days : null;
  } catch {
    return null;
  }
}

// ── Source A: LeetCode's own GraphQL, combined query — gets calendar AND
// solved-count stats in a single upstream request (fewer round trips than
// hitting separate third-party mirrors for each piece). ──────────────────
async function fromLeetCodeGraphQL(username: string, year: number): Promise<Result> {
  const homeRes = await fetch("https://leetcode.com", { headers: { "User-Agent": UA }, signal: withTimeout(SOURCE_TIMEOUT_MS) });
  const rawCookies = homeRes.headers.get("set-cookie") ?? "";
  const csrfToken = rawCookies.match(/csrftoken=([^;,\s]+)/)?.[1] ?? "";

  const gqlRes = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    signal: withTimeout(SOURCE_TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://leetcode.com",
      "Origin": "https://leetcode.com",
      "User-Agent": UA,
      ...(csrfToken ? { Cookie: `csrftoken=${csrfToken}`, "x-csrftoken": csrfToken } : {}),
    },
    body: JSON.stringify({
      query: `query userProfileCombined($username: String!, $year: Int) {
        matchedUser(username: $username) {
          profile { ranking }
          submitStatsGlobal { acSubmissionNum { difficulty count } }
          userCalendar(year: $year) { submissionCalendar }
        }
        allQuestionsCount { difficulty count }
      }`,
      variables: { username, year },
    }),
  });

  if (!gqlRes.ok) return { days: null, profile: null };
  const j = await gqlRes.json();
  const mu = j?.data?.matchedUser;

  const days = mu?.userCalendar?.submissionCalendar ? parseDays(mu.userCalendar.submissionCalendar) : null;

  let profile: ProfileStats | null = null;
  const ac: { difficulty: string; count: number }[] | undefined = mu?.submitStatsGlobal?.acSubmissionNum;
  const totals: { difficulty: string; count: number }[] | undefined = j?.data?.allQuestionsCount;
  if (ac) {
    const get = (arr: { difficulty: string; count: number }[] | undefined, key: string) =>
      arr?.find(x => x.difficulty === key)?.count ?? 0;
    const easySolved = get(ac, "Easy"), mediumSolved = get(ac, "Medium"), hardSolved = get(ac, "Hard");
    profile = {
      easySolved, mediumSolved, hardSolved,
      totalEasy: get(totals, "Easy") || 947,
      totalMedium: get(totals, "Medium") || 2063,
      totalHard: get(totals, "Hard") || 939,
      totalSolved: get(ac, "All") || (easySolved + mediumSolved + hardSolved),
      ranking: mu?.profile?.ranking ?? 150000,
    };
  }
  return { days, profile };
}

// ── Source B: alfa-leetcode-api mirror — calendar + profile fetched
// concurrently against the same source. ───────────────────────────────────
async function fromAlfaApi(username: string, year: number): Promise<Result> {
  const [calRes, profRes] = await Promise.allSettled([
    fetch(`https://alfa-leetcode-api.onrender.com/userProfileCalendar?username=${username}&year=${year}`, { headers: { "User-Agent": UA }, signal: withTimeout(SOURCE_TIMEOUT_MS) }),
    fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`, { headers: { "User-Agent": UA }, signal: withTimeout(SOURCE_TIMEOUT_MS) }),
  ]);

  let days: CalDay[] | null = null;
  if (calRes.status === "fulfilled" && calRes.value.ok) {
    const cj = await calRes.value.json();
    days = parseDays(cj?.submissionCalendar ?? cj?.calendar);
  }

  let profile: ProfileStats | null = null;
  if (profRes.status === "fulfilled" && profRes.value.ok) {
    const pj = await profRes.value.json();
    if (pj && !pj.error) {
      const easySolved = pj.easySolved ?? pj.totalEasySolved ?? 0;
      const mediumSolved = pj.mediumSolved ?? pj.totalMediumSolved ?? 0;
      const hardSolved = pj.hardSolved ?? pj.totalHardSolved ?? 0;
      profile = {
        easySolved, mediumSolved, hardSolved,
        totalEasy: pj.totalEasy ?? 947, totalMedium: pj.totalMedium ?? 2063, totalHard: pj.totalHard ?? 939,
        totalSolved: pj.totalSolved ?? (easySolved + mediumSolved + hardSolved),
        ranking: pj.ranking ?? 150000,
      };
    }
  }
  return { days, profile };
}

// ── Source C: faisalshohag mirror (Vercel) — calendar only, used to fill
// in whichever piece is still missing after A and B. ──────────────────────
async function fromFaisalshohagApi(username: string): Promise<Result> {
  const r = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`, { headers: { "User-Agent": UA }, signal: withTimeout(SOURCE_TIMEOUT_MS) });
  if (!r.ok) return { days: null, profile: null };
  const cj = await r.json();
  const days = parseDays(cj?.submissionCalendar ?? cj?.recentSubmissionList);
  let profile: ProfileStats | null = null;
  if (typeof cj?.easySolved === "number" || typeof cj?.totalSolved === "number") {
    const easySolved = cj.easySolved ?? 0, mediumSolved = cj.mediumSolved ?? 0, hardSolved = cj.hardSolved ?? 0;
    profile = {
      easySolved, mediumSolved, hardSolved,
      totalEasy: cj.totalEasy ?? 947, totalMedium: cj.totalMedium ?? 2063, totalHard: cj.totalHard ?? 939,
      totalSolved: cj.totalSolved ?? (easySolved + mediumSolved + hardSolved),
      ranking: cj.ranking ?? 150000,
    };
  }
  return { days, profile };
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") ?? "IThakur09";
  const year = Number(req.nextUrl.searchParams.get("year") ?? new Date().getFullYear());

  // Race all three sources concurrently (not sequentially) so a dead/slow
  // one never blocks the response — merge whichever fields each source
  // actually returned, keeping the first non-null value found per field.
  const settled = await Promise.allSettled([
    fromLeetCodeGraphQL(username, year),
    fromAlfaApi(username, year),
    fromFaisalshohagApi(username),
  ]);

  let days: CalDay[] | null = null;
  let profile: ProfileStats | null = null;
  for (const s of settled) {
    if (s.status !== "fulfilled") continue;
    if (!days && s.value.days) days = s.value.days;
    if (!profile && s.value.profile) profile = s.value.profile;
    if (days && profile) break;
  }

  return NextResponse.json(
    { days: days ?? [], profile },
    {
      // Edge/CDN caches the good result for an hour and keeps serving it
      // (while quietly refetching) for a day after that — so a temporary
      // outage on every upstream source still serves last-known-good data
      // instead of a blank/wrong card.
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
    }
  );
}