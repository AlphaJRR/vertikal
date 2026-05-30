import type { CanonicalLesson } from "./types";

export type { CanonicalLesson } from "./types";
import l0 from "./camera_aperture_depth.json";
import l1 from "./camera_aperture_priority.json";
import l2 from "./camera_autofocus_manual.json";
import l3 from "./camera_bitrate_codecs.json";
import l4 from "./camera_dolly_slider.json";
import l5 from "./camera_exposure_triangle.json";
import l6 from "./camera_file_formats_resolutions.json";
import l7 from "./camera_focal_length.json";
import l8 from "./camera_frame_rates.json";
import l9 from "./camera_gimbal.json";
import l10 from "./camera_handheld.json";
import l11 from "./camera_histogram_zebras.json";
import l12 from "./camera_iso_noise.json";
import l13 from "./camera_log_standard_profiles.json";
import l14 from "./camera_manual_mode.json";
import l15 from "./camera_nd_filters.json";
import l16 from "./camera_picture_profiles.json";
import l17 from "./camera_prime_vs_zoom.json";
import l18 from "./camera_raw_vs_compressed.json";
import l19 from "./camera_sensor_size.json";
import l20 from "./camera_shutter_motion.json";
import l21 from "./camera_shutter_priority.json";
import l22 from "./camera_stabilization.json";
import l23 from "./camera_static.json";
import l24 from "./camera_whip_pan.json";
import l25 from "./camera_white_balance.json";
import l26 from "./editing_basic_cut.json";
import l27 from "./editing_color_wheels.json";
import l28 from "./editing_curves.json";
import l29 from "./editing_dialogue_cleanup.json";
import l30 from "./editing_dissolve.json";
import l31 from "./editing_export_archive.json";
import l32 from "./editing_export_client.json";
import l33 from "./editing_export_social.json";
import l34 from "./editing_export_youtube.json";
import l35 from "./editing_fairlight_basics.json";
import l36 from "./editing_hand_draw_overlay.json";
import l37 from "./editing_hard_cut.json";
import l38 from "./editing_importing.json";
import l39 from "./editing_interface_overview.json";
import l40 from "./editing_jl_cut.json";
import l41 from "./editing_log_workflow.json";
import l42 from "./editing_luts.json";
import l43 from "./editing_match_cut_grade.json";
import l44 from "./editing_match_cut_transition.json";
import l45 from "./editing_music_licensing.json";
import l46 from "./editing_node_structure.json";
import l47 from "./editing_project_setup.json";
import l48 from "./editing_reading_scopes.json";
import l49 from "./editing_skin_tone_correction.json";
import l50 from "./editing_sound_design.json";
import l51 from "./editing_whip_pan_transition.json";
import l52 from "./framing_cu.json";
import l53 from "./framing_depth_layers.json";
import l54 from "./framing_dutch_angle.json";
import l55 from "./framing_ecu.json";
import l56 from "./framing_ews.json";
import l57 from "./framing_framing_within_frame.json";
import l58 from "./framing_headroom_lookroom.json";
import l59 from "./framing_high_low_angle.json";
import l60 from "./framing_leading_lines.json";
import l61 from "./framing_ms.json";
import l62 from "./framing_negative_space.json";
import l63 from "./framing_rule_of_thirds.json";
import l64 from "./framing_symmetry.json";
import l65 from "./framing_vertical_composition.json";
import l66 from "./framing_wide_vs_tight.json";
import l67 from "./framing_ws.json";
import l68 from "./lighting_backlight_silhouette.json";
import l69 from "./lighting_butterfly.json";
import l70 from "./lighting_cinematic_setup.json";
import l71 from "./lighting_color_temperature.json";
import l72 from "./lighting_hard_soft_light.json";
import l73 from "./lighting_interview_setup.json";
import l74 from "./lighting_low_budget_setup.json";
import l75 from "./lighting_natural_light.json";
import l76 from "./lighting_outdoor_setup.json";
import l77 from "./lighting_portrait_setup.json";
import l78 from "./lighting_practical_lights.json";
import l79 from "./lighting_practical_motivated.json";
import l80 from "./lighting_rembrandt_lighting.json";
import l81 from "./lighting_split_light.json";
import l82 from "./lighting_three_point_lighting.json";
import l83 from "./strategy_batch_shooting.json";
import l84 from "./strategy_client_communication.json";
import l85 from "./strategy_content_calendar.json";
import l86 from "./strategy_content_pillars.json";
import l87 from "./strategy_hook_formula.json";
import l88 from "./strategy_hooks_that_convert.json";
import l89 from "./strategy_instagram_reels.json";
import l90 from "./strategy_linkedin.json";
import l91 from "./strategy_niche_vs_identity.json";
import l92 from "./strategy_portfolio.json";
import l93 from "./strategy_pricing.json";
import l94 from "./strategy_repurposing_content.json";
import l95 from "./strategy_tiktok_native.json";
import l96 from "./strategy_youtube_titles_thumbs.json";

/** Canonical lesson ids — JSON files under data/lessons/ are source of truth. */
export const LESSON_IDS = [
  "camera_aperture_depth",
  "camera_aperture_priority",
  "camera_autofocus_manual",
  "camera_bitrate_codecs",
  "camera_dolly_slider",
  "camera_exposure_triangle",
  "camera_file_formats_resolutions",
  "camera_focal_length",
  "camera_frame_rates",
  "camera_gimbal",
  "camera_handheld",
  "camera_histogram_zebras",
  "camera_iso_noise",
  "camera_log_standard_profiles",
  "camera_manual_mode",
  "camera_nd_filters",
  "camera_picture_profiles",
  "camera_prime_vs_zoom",
  "camera_raw_vs_compressed",
  "camera_sensor_size",
  "camera_shutter_motion",
  "camera_shutter_priority",
  "camera_stabilization",
  "camera_static",
  "camera_whip_pan",
  "camera_white_balance",
  "editing_basic_cut",
  "editing_color_wheels",
  "editing_curves",
  "editing_dialogue_cleanup",
  "editing_dissolve",
  "editing_export_archive",
  "editing_export_client",
  "editing_export_social",
  "editing_export_youtube",
  "editing_fairlight_basics",
  "editing_hand_draw_overlay",
  "editing_hard_cut",
  "editing_importing",
  "editing_interface_overview",
  "editing_jl_cut",
  "editing_log_workflow",
  "editing_luts",
  "editing_match_cut_grade",
  "editing_match_cut_transition",
  "editing_music_licensing",
  "editing_node_structure",
  "editing_project_setup",
  "editing_reading_scopes",
  "editing_skin_tone_correction",
  "editing_sound_design",
  "editing_whip_pan_transition",
  "framing_cu",
  "framing_depth_layers",
  "framing_dutch_angle",
  "framing_ecu",
  "framing_ews",
  "framing_framing_within_frame",
  "framing_headroom_lookroom",
  "framing_high_low_angle",
  "framing_leading_lines",
  "framing_ms",
  "framing_negative_space",
  "framing_rule_of_thirds",
  "framing_symmetry",
  "framing_vertical_composition",
  "framing_wide_vs_tight",
  "framing_ws",
  "lighting_backlight_silhouette",
  "lighting_butterfly",
  "lighting_cinematic_setup",
  "lighting_color_temperature",
  "lighting_hard_soft_light",
  "lighting_interview_setup",
  "lighting_low_budget_setup",
  "lighting_natural_light",
  "lighting_outdoor_setup",
  "lighting_portrait_setup",
  "lighting_practical_lights",
  "lighting_practical_motivated",
  "lighting_rembrandt_lighting",
  "lighting_split_light",
  "lighting_three_point_lighting",
  "strategy_batch_shooting",
  "strategy_client_communication",
  "strategy_content_calendar",
  "strategy_content_pillars",
  "strategy_hook_formula",
  "strategy_hooks_that_convert",
  "strategy_instagram_reels",
  "strategy_linkedin",
  "strategy_niche_vs_identity",
  "strategy_portfolio",
  "strategy_pricing",
  "strategy_repurposing_content",
  "strategy_tiktok_native",
  "strategy_youtube_titles_thumbs",
] as const;

export type LessonId = (typeof LESSON_IDS)[number];

const LESSON_MAP = {
  "camera_aperture_depth": l0,
  "camera_aperture_priority": l1,
  "camera_autofocus_manual": l2,
  "camera_bitrate_codecs": l3,
  "camera_dolly_slider": l4,
  "camera_exposure_triangle": l5,
  "camera_file_formats_resolutions": l6,
  "camera_focal_length": l7,
  "camera_frame_rates": l8,
  "camera_gimbal": l9,
  "camera_handheld": l10,
  "camera_histogram_zebras": l11,
  "camera_iso_noise": l12,
  "camera_log_standard_profiles": l13,
  "camera_manual_mode": l14,
  "camera_nd_filters": l15,
  "camera_picture_profiles": l16,
  "camera_prime_vs_zoom": l17,
  "camera_raw_vs_compressed": l18,
  "camera_sensor_size": l19,
  "camera_shutter_motion": l20,
  "camera_shutter_priority": l21,
  "camera_stabilization": l22,
  "camera_static": l23,
  "camera_whip_pan": l24,
  "camera_white_balance": l25,
  "editing_basic_cut": l26,
  "editing_color_wheels": l27,
  "editing_curves": l28,
  "editing_dialogue_cleanup": l29,
  "editing_dissolve": l30,
  "editing_export_archive": l31,
  "editing_export_client": l32,
  "editing_export_social": l33,
  "editing_export_youtube": l34,
  "editing_fairlight_basics": l35,
  "editing_hand_draw_overlay": l36,
  "editing_hard_cut": l37,
  "editing_importing": l38,
  "editing_interface_overview": l39,
  "editing_jl_cut": l40,
  "editing_log_workflow": l41,
  "editing_luts": l42,
  "editing_match_cut_grade": l43,
  "editing_match_cut_transition": l44,
  "editing_music_licensing": l45,
  "editing_node_structure": l46,
  "editing_project_setup": l47,
  "editing_reading_scopes": l48,
  "editing_skin_tone_correction": l49,
  "editing_sound_design": l50,
  "editing_whip_pan_transition": l51,
  "framing_cu": l52,
  "framing_depth_layers": l53,
  "framing_dutch_angle": l54,
  "framing_ecu": l55,
  "framing_ews": l56,
  "framing_framing_within_frame": l57,
  "framing_headroom_lookroom": l58,
  "framing_high_low_angle": l59,
  "framing_leading_lines": l60,
  "framing_ms": l61,
  "framing_negative_space": l62,
  "framing_rule_of_thirds": l63,
  "framing_symmetry": l64,
  "framing_vertical_composition": l65,
  "framing_wide_vs_tight": l66,
  "framing_ws": l67,
  "lighting_backlight_silhouette": l68,
  "lighting_butterfly": l69,
  "lighting_cinematic_setup": l70,
  "lighting_color_temperature": l71,
  "lighting_hard_soft_light": l72,
  "lighting_interview_setup": l73,
  "lighting_low_budget_setup": l74,
  "lighting_natural_light": l75,
  "lighting_outdoor_setup": l76,
  "lighting_portrait_setup": l77,
  "lighting_practical_lights": l78,
  "lighting_practical_motivated": l79,
  "lighting_rembrandt_lighting": l80,
  "lighting_split_light": l81,
  "lighting_three_point_lighting": l82,
  "strategy_batch_shooting": l83,
  "strategy_client_communication": l84,
  "strategy_content_calendar": l85,
  "strategy_content_pillars": l86,
  "strategy_hook_formula": l87,
  "strategy_hooks_that_convert": l88,
  "strategy_instagram_reels": l89,
  "strategy_linkedin": l90,
  "strategy_niche_vs_identity": l91,
  "strategy_portfolio": l92,
  "strategy_pricing": l93,
  "strategy_repurposing_content": l94,
  "strategy_tiktok_native": l95,
  "strategy_youtube_titles_thumbs": l96,
} as Record<LessonId, CanonicalLesson>;

export function getLessonById(id: string): CanonicalLesson | undefined {
  return LESSON_MAP[id as LessonId];
}

export function getAllLessons(): CanonicalLesson[] {
  return LESSON_IDS.map((id) => LESSON_MAP[id]);
}
