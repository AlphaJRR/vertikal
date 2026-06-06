/// <reference path="../worker-configuration.d.ts" />

interface Env {
  /** Set via `wrangler secret put EMAIL_API_KEY` (never commit). */
  EMAIL_API_KEY: string;
  /** Verified destination for inbound forwards (`wrangler email routing addresses create`). */
  FORWARD_TO: string;
  /** Set to `"true"` in wrangler vars to send an auto-reply to the sender. */
  AUTO_REPLY_ENABLED?: string;
}
