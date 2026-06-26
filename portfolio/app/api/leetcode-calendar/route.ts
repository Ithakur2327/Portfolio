import { NextRequest, NextResponse } from "next/server";

// Use nodejs runtime — edge runtime strips cookies from upstream responses
export const runtime = "nodejs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

function parseDays(calStr: unknown): { date: number; count: number }[] | null {
  try {
    const obj: Record<string, number> =
      typeof calStr === "string" ? JSON.parse(calStr) : (calStr as Record<string, number>);
    const days = Object.entries(obj).map(([ts, cnt]) => ({
      date: Number(ts),
      count: Number(cnt),
    }));
    return days.length > 0 ? days : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") ?? "IThakur09";
  const year = Number(req.nextUrl.searchParams.get("year") ?? new Date().getFullYear());

  // ── Method 1: LeetCode GraphQL with CSRF token ──────────────────────────────
  // LeetCode requires csrftoken cookie + x-csrftoken header since late 2024.
  // We grab the token from a lightweight GET first, then fire the GraphQL query.
  try {
    // Step 1: get csrftoken from leetcode.com homepage cookie
    const homeRes = await fetch("https://leetcode.com", {
      headers: { "User-Agent": UA },
    });
    const rawCookies = homeRes.headers.get("set-cookie") ?? "";
    const csrfMatch = rawCookies.match(/csrftoken=([^;,\s]+)/);
    const csrfToken = csrfMatch?.[1] ?? "";

    // Step 2: GraphQL with token
    const gqlRes = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "Origin": "https://leetcode.com",
        "User-Agent": UA,
        ...(csrfToken
          ? { Cookie: `csrftoken=${csrfToken}`, "x-csrftoken": csrfToken }
          : {}),
      },
      body: JSON.stringify({
        query: `query userProfileCalendar($username: String!, $year: Int) {
          matchedUser(username: $username) {
            userCalendar(year: $year) { submissionCalendar }
          }
        }`,
        variables: { username, year },
      }),
    });

    if (gqlRes.ok) {
      const j = await gqlRes.json();
      const calStr = j?.data?.matchedUser?.userCalendar?.submissionCalendar;
      const days = calStr ? parseDays(calStr) : null;
      if (days) {
        return NextResponse.json({ days }, {
          headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
        });
      }
    }
  } catch { /* fall through */ }

  // ── Method 2: alfa-leetcode-api (Render) ─────────────────────────────────────
  try {
    const r = await fetch(
      `https://alfa-leetcode-api.onrender.com/userProfileCalendar?username=${username}&year=${year}`,
      { headers: { "User-Agent": UA } }
    );
    if (r.ok) {
      const cj = await r.json();
      const calStr = cj?.submissionCalendar ?? cj?.calendar;
      const days = calStr ? parseDays(calStr) : null;
      if (days) {
        return NextResponse.json({ days }, {
          headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
        });
      }
    }
  } catch { /* fall through */ }

  // ── Method 3: leetcode-api by faisalshohag (Vercel) ──────────────────────────
  try {
    const r = await fetch(
      `https://leetcode-api-faisalshohag.vercel.app/${username}`,
      { headers: { "User-Agent": UA } }
    );
    if (r.ok) {
      const cj = await r.json();
      const calStr = cj?.submissionCalendar ?? cj?.recentSubmissionList;
      const days = calStr ? parseDays(calStr) : null;
      if (days) {
        return NextResponse.json({ days }, {
          headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
        });
      }
    }
  } catch { /* fall through */ }

  return NextResponse.json({ days: [] }, { status: 200 });
}