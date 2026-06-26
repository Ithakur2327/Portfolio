import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // fast, no cold-start

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") ?? "IThakur09";
  const year = Number(req.nextUrl.searchParams.get("year") ?? new Date().getFullYear());

  const graphqlQuery = {
    query: `query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          submissionCalendar
        }
      }
    }`,
    variables: { username, year },
  };

  // 1) LeetCode official GraphQL – works fine server-side (no CORS)
  try {
    const r = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify(graphqlQuery),
      // edge runtime supports signal via AbortController
    });
    if (r.ok) {
      const j = await r.json();
      const calStr = j?.data?.matchedUser?.userCalendar?.submissionCalendar;
      if (calStr) {
        const calObj: Record<string, number> = JSON.parse(calStr);
        const days = Object.entries(calObj).map(([ts, cnt]) => ({
          date: Number(ts),
          count: Number(cnt),
        }));
        return NextResponse.json({ days }, {
          headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
        });
      }
    }
  } catch { /* fall through */ }

  // 2) Fallback: alfa-leetcode-api
  try {
    const r = await fetch(
      `https://alfa-leetcode-api.onrender.com/userProfileCalendar?username=${username}&year=${year}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (r.ok) {
      const cj = await r.json();
      const calStr = cj?.submissionCalendar ?? cj?.calendar;
      if (calStr) {
        const calObj: Record<string, number> =
          typeof calStr === "string" ? JSON.parse(calStr) : calStr;
        const days = Object.entries(calObj).map(([ts, cnt]) => ({
          date: Number(ts),
          count: Number(cnt),
        }));
        return NextResponse.json({ days }, {
          headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
        });
      }
    }
  } catch { /* fall through */ }

  // Nothing worked – return empty so the client can show blank grid gracefully
  return NextResponse.json({ days: [] }, { status: 200 });
}