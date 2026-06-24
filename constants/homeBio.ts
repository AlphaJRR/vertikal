import { ImageSourcePropType, ImageResizeMode } from "react-native";

/** Autoplay interval for JR bio carousel on Home. */
export const BIO_SLIDESHOW_INTERVAL_MS = 4500;

/** Resume autoplay after tap-pause if user does not swipe. */
export const BIO_SLIDESHOW_RESUME_MS = 9000;

/** Matches Home section horizontal padding (`index.tsx` sectionHead / tipsList). */
export const BIO_HOME_HORIZONTAL_PADDING = 20;

export type BioSlide = {
  source: ImageSourcePropType;
  resizeMode?: ImageResizeMode;
  /** Dark UI — black keyed out of PNG (About page portrait treatment). */
  cutoutOnDark?: boolean;
};

/** Portrait bio slides (576×1024, 9:16) — title through Let's Create Together + promo/portrait. */
export const BIO_SLIDES: BioSlide[] = [
  { source: require("../assets/home/bio/JRR_ALPHA_Bio_TItlepage.png") },
  { source: require("../assets/home/bio/2_a_visual_story_teller_alphajrr_bio_vert.png") },
  { source: require("../assets/home/bio/3ava_insprirealphajrr_bio_vert.png") },
  { source: require("../assets/home/bio/4.png") },
  { source: require("../assets/home/bio/5.png") },
  { source: require("../assets/home/bio/6lets_create_together_alphajrr_bio_vert.png") },
  { source: require("../assets/home/bio/7_alpha_visual_artists_promo.jpg") },
  {
    source: require("../assets/home/bio/8_jr_black_portrait.png"),
    resizeMode: "contain",
    cutoutOnDark: true,
  },
];
