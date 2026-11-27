import { createHash } from "crypto";
import { readFileSync } from "fs";
import path from "path";

/**
 * Content hash of both avatar photos. Used as a cache-busting `?v=` so the
 * preloaded URL and the URL the page actually requests are byte-identical.
 * Server-only (runs at build / render time).
 */
export function getAvatarVersion(): string {
  try {
    const dir = path.join(process.cwd(), "public");
    return createHash("md5")
      .update(readFileSync(path.join(dir, "avatar-dark.jpg")))
      .update(readFileSync(path.join(dir, "avatar-light.jpg")))
      .digest("hex")
      .slice(0, 10);
  } catch {
    return "0";
  }
}