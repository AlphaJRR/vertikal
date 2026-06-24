/** Cloudflare Stream customer host — matches marketing site + featured reels. */
export const CLOUDFLARE_STREAM_CUSTOMER =
  "customer-fyh68ijrcuys7ag8.cloudflarestream.com";

/** Mama Connie — The Hamptons Pt 1 (marketing hero featured film). */
export const MAMA_CONNIE_HOME_STREAM_ID = "9d8f90ef4ad7daae526ad11df1ba3d60";

export const MAMA_CONNIE_HOME_LABEL = "Mama Connie — The Hamptons Pt 1";

export const cloudflareStreamHls = (uid: string) => ({
  uri: `https://${CLOUDFLARE_STREAM_CUSTOMER}/${uid}/manifest/video.m3u8`,
});
