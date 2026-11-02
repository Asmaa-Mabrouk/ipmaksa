import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

/** Search and AI crawlers are welcome on public pages. Admin, account and API-like paths stay out. */
const BLOCK = ["/admin", "/*/profile", "/*/login", "/*/register", "/*/forgot-password", "/*/reset-password"];
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider", "cohere-ai", "Amazonbot", "meta-externalagent"];
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: BLOCK },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: BLOCK },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
