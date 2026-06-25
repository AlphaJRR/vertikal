/**
 * Stage 1 kill-switch — inline HLS on Home stays off; tap-to-play via VideoModal
 * (reels) and InterviewCard (JR Interviews) still works.
 * Set false in stage 2 once inline mounts are verified on device.
 */
export const DISABLE_HOME_VIDEOS = true;

/**
 * Mama Connie is the single featured film player on Home. Keep this separate
 * from the reel kill-switch so one hero player can mount while reel rows stay
 * tap-to-play for cold-start stability.
 */
export const ENABLE_MAMA_CONNIE_HOME_VIDEO = true;
