/**
 * Alpha Creators Toolkit — equipment presets, Sony shooting modes, scenarios
 */

export interface AudioSettings {
  inputLevel: string;
  micType: string;
  windCut: boolean;
  limiter: boolean;
  sampleRate: string;
  bitDepth: string;
}

export interface CameraSettings {
  mode: string;
  pictureProfile: string;
  iso: string;
  shutter: string;
  aperture: string;
  whiteBalance: string;
  focusMode: string;
  stabilization: string;
  resolution: string;
  frameRate: string;
}

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  category: 'interview' | 'run-gun' | 'cinematic' | 'event' | 'podcast' | 'custom';
  camera: CameraSettings;
  audio: AudioSettings;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SonyModeGuide {
  id: string;
  name: string;
  shortName: string;
  dialPosition: string;
  summary: string;
  bestFor: string[];
  controls: string[];
  tips: string[];
  shutterGuide?: string;
  apertureGuide?: string;
  isoRecommendation: string;
  commonMistakes: string[];
}

export interface ShootingScenario {
  id: string;
  title: string;
  environment: string;
  recommendedMode: string;
  camera: Partial<CameraSettings>;
  audio: Partial<AudioSettings>;
  checklist: string[];
}

const now = () => new Date().toISOString();

export const DEFAULT_PRESETS: PresetConfig[] = [
  {
    id: 'preset-interview-4k',
    name: 'Interview — 4K 24fps',
    description: 'Clean talking-head setup with shallow depth and safe audio levels.',
    category: 'interview',
    camera: {
      mode: 'Manual (M)',
      pictureProfile: 'S-Cinetone',
      iso: '400–800',
      shutter: '1/50 (24fps)',
      aperture: 'f/2.8–f/4',
      whiteBalance: '5500K or gray card',
      focusMode: 'AF-C + face/eye detect',
      stabilization: 'Active / Standard',
      resolution: '4K',
      frameRate: '24fps',
    },
    audio: {
      inputLevel: '-12 dB peak target',
      micType: 'Shotgun on camera / lav',
      windCut: true,
      limiter: true,
      sampleRate: '48 kHz',
      bitDepth: '24-bit',
    },
    notes: 'Use 180° shutter rule. Monitor with headphones. Record safety track at -6 dB lower if dual system.',
    tags: ['interview', '4k', 'talking-head'],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'preset-run-gun',
    name: 'Run & Gun — Event',
    description: 'Fast-moving environments with reliable autofocus and higher shutter.',
    category: 'run-gun',
    camera: {
      mode: 'Shutter Priority (S)',
      pictureProfile: 'S-Cinetone',
      iso: 'Auto ISO cap 6400',
      shutter: '1/100–1/200',
      aperture: 'Auto (controlled by S mode)',
      whiteBalance: 'Auto WB fine-tune +1',
      focusMode: 'AF-C wide / zone',
      stabilization: 'Active',
      resolution: '4K',
      frameRate: '60fps',
    },
    audio: {
      inputLevel: '-18 dB peak',
      micType: 'On-camera shotgun',
      windCut: true,
      limiter: true,
      sampleRate: '48 kHz',
      bitDepth: '24-bit',
    },
    notes: 'Prioritize sharp motion over cinematic blur. Check highlight warning zebras at 95+.',
    tags: ['event', 'run-gun', '60fps'],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'preset-cinematic-broll',
    name: 'Cinematic B-Roll',
    description: 'Slow motion beauty shots with controlled motion blur.',
    category: 'cinematic',
    camera: {
      mode: 'Manual (M)',
      pictureProfile: 'S-Log3 (10-bit if available)',
      iso: '800 native',
      shutter: '1/100 (50fps) or 1/120 (60fps)',
      aperture: 'f/2–f/2.8',
      whiteBalance: 'Fixed Kelvin (no AWB)',
      focusMode: 'MF with focus peaking',
      stabilization: 'Off (use gimbal/tripod)',
      resolution: '4K',
      frameRate: '50/60fps',
    },
    audio: {
      inputLevel: 'N/A — music in post',
      micType: 'Optional ambient',
      windCut: false,
      limiter: false,
      sampleRate: '48 kHz',
      bitDepth: '24-bit',
    },
    notes: 'Expose S-Log3 ~1.7 stops over middle gray. Use LUT in post. ND filters required outdoors.',
    tags: ['broll', 's-log3', 'slow-mo'],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'preset-podcast',
    name: 'Podcast / Voice',
    description: 'Audio-first configuration with locked-off camera.',
    category: 'podcast',
    camera: {
      mode: 'Aperture Priority (A)',
      pictureProfile: 'S-Cinetone',
      iso: '400',
      shutter: '1/50',
      aperture: 'f/4',
      whiteBalance: '5000K',
      focusMode: 'AF-S on host chair',
      stabilization: 'Off',
      resolution: '1080p',
      frameRate: '24fps',
    },
    audio: {
      inputLevel: '-12 dB peak (lav), -18 dB (room)',
      micType: 'XLR lav or dynamic broadcast mic',
      windCut: false,
      limiter: true,
      sampleRate: '48 kHz',
      bitDepth: '24-bit',
    },
    notes: 'Treat room acoustics first. Use high-pass at 80 Hz if rumble present.',
    tags: ['podcast', 'audio', 'studio'],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'preset-low-light',
    name: 'Low Light — Reception',
    description: 'Maximum light gathering with acceptable noise.',
    category: 'event',
    camera: {
      mode: 'Manual (M)',
      pictureProfile: 'S-Cinetone',
      iso: '3200–12800',
      shutter: '1/50',
      aperture: 'f/1.8–f/2.8',
      whiteBalance: '3200K (tungsten venues)',
      focusMode: 'AF-C low-light priority',
      stabilization: 'Active',
      resolution: '4K',
      frameRate: '24fps',
    },
    audio: {
      inputLevel: '-15 dB peak',
      micType: 'Shotgun + wireless lav backup',
      windCut: false,
      limiter: true,
      sampleRate: '48 kHz',
      bitDepth: '24-bit',
    },
    notes: 'Accept some noise over motion blur. Use noise reduction lightly in post only.',
    tags: ['low-light', 'reception', 'wedding'],
    createdAt: now(),
    updatedAt: now(),
  },
];

export const SONY_SHOOTING_MODES: SonyModeGuide[] = [
  {
    id: 'auto',
    name: 'Intelligent Auto',
    shortName: 'AUTO',
    dialPosition: 'AUTO',
    summary: 'Camera chooses exposure, focus, and scene settings automatically.',
    bestFor: ['Beginners', 'Family snapshots', 'Quick reference clips'],
    controls: ['Scene recognition', 'Auto ISO', 'Auto WB', 'Auto focus'],
    tips: [
      'Fastest way to start shooting but least creative control.',
      'Override flash when not needed to avoid flat lighting.',
    ],
    isoRecommendation: 'Camera controlled — typically 100–3200',
    commonMistakes: ['Relying on AUTO for paid client work', 'Inconsistent look shot-to-shot'],
  },
  {
    id: 'program',
    name: 'Program Auto',
    shortName: 'P',
    dialPosition: 'P',
    summary: 'Sets aperture and shutter automatically while you control ISO, WB, and drive mode.',
    bestFor: ['Street', 'Travel', 'Run-and-gun when you need speed'],
    controls: ['Program shift (flexible combo of A/S)', 'Exposure compensation', 'ISO'],
    tips: [
      'Use exposure compensation aggressively for backlit subjects.',
      'Program shift lets you bias toward faster shutter or more depth of field.',
    ],
    isoRecommendation: '100–6400 depending on light; cap Auto ISO in menu',
    commonMistakes: ['Forgetting exposure compensation', 'Slow shutter in low light causing blur'],
  },
  {
    id: 'shutter',
    name: 'Shutter Priority',
    shortName: 'S / Tv',
    dialPosition: 'S',
    summary: 'You set shutter speed; camera selects aperture for correct exposure.',
    bestFor: ['Sports', 'Action', 'Kids', 'Handheld run-and-gun'],
    controls: ['Shutter speed', 'ISO', 'Exposure compensation'],
    tips: [
      'Use 2× frame rate rule: 24fps → 1/50, 60fps → 1/120.',
      'Raise ISO before dropping shutter below safe handheld speed.',
    ],
    shutterGuide:
      '1/50–1/60 for 24/30fps video | 1/100+ for action | 1/250+ for sports stills',
    isoRecommendation: 'Auto ISO with max 6400–12800 for events',
    commonMistakes: ['Shutter too slow → motion blur', 'Underexposure when max aperture reached'],
  },
  {
    id: 'aperture',
    name: 'Aperture Priority',
    shortName: 'A / Av',
    dialPosition: 'A',
    summary: 'You set aperture (f-stop); camera selects shutter for exposure.',
    bestFor: ['Interviews', 'Portraits', 'Controlled depth of field'],
    controls: ['Aperture (f-stop)', 'ISO', 'Exposure compensation'],
    tips: [
      'Wider aperture (lower f-number) = more blur, less in focus.',
      'Watch shutter — if it drops below 1/50, raise ISO or add light.',
    ],
    apertureGuide: 'f/1.4–f/2.8 shallow | f/4–f/5.6 general | f/8+ deep focus',
    isoRecommendation: '100–3200 for controlled lighting',
    commonMistakes: ['Shutter too slow indoors at f/1.8', 'Missing focus at f/1.4 on moving subjects'],
  },
  {
    id: 'manual',
    name: 'Manual',
    shortName: 'M',
    dialPosition: 'M',
    summary: 'Full control of aperture, shutter, and ISO — best for consistent professional results.',
    bestFor: ['Interviews', 'Cinematic work', 'Studio', 'Matching shots'],
    controls: ['Aperture', 'Shutter', 'ISO', 'Manual focus', 'Waveform / zebras'],
    tips: [
      'Use zebras at 95+ for skin highlights on S-Cinetone.',
      'Lock white balance — never AWB for multi-shot scenes.',
      'Match exposure using false color or waveform if available.',
    ],
    shutterGuide: '180° rule: shutter ≈ 2× frame rate (24fps → 1/48 or 1/50)',
    apertureGuide: 'Choose for depth, then balance shutter + ISO',
    isoRecommendation: 'Lowest native ISO that achieves exposure (often 400–800)',
    commonMistakes: ['Clipping highlights in S-Log without monitoring', 'Inconsistent WB between takes'],
  },
  {
    id: 'movie',
    name: 'Movie / Video',
    shortName: 'MOVIE',
    dialPosition: 'Movie (camera dependent)',
    summary: 'Video-optimized controls, often with full manual exposure and picture profiles.',
    bestFor: ['All professional video work', 'S-Log / S-Cinetone', 'Client deliverables'],
    controls: ['Frame rate', 'Shutter angle', 'Picture profile', 'Focus peaking', 'Audio levels'],
    tips: [
      'Set shutter with 180° rule before adjusting aperture.',
      'Use picture profile appropriate to delivery (S-Cinetone for fast turnaround).',
      'Assign custom buttons for AF/MF toggle and zebra levels.',
    ],
    shutterGuide: '24fps → 1/50 | 30fps → 1/60 | 60fps → 1/120',
    apertureGuide: 'Control depth; pair with ND filters in daylight',
    isoRecommendation: 'Native ISO (often 800 for S-Log3, lower for S-Cinetone)',
    commonMistakes: ['Shooting AUTO WB in video', 'Wrong frame rate for region (23.976 vs 24)'],
  },
];

export const SHOOTING_SCENARIOS: ShootingScenario[] = [
  {
    id: 'scenario-outdoor-interview',
    title: 'Outdoor Interview — Sun',
    environment: 'Bright daylight, subject in open shade',
    recommendedMode: 'Manual (M) or Aperture Priority (A)',
    camera: {
      mode: 'M',
      aperture: 'f/2.8–f/4',
      shutter: '1/50',
      iso: '100–200',
      whiteBalance: '5500K',
      pictureProfile: 'S-Cinetone',
    },
    audio: {
      micType: 'Boom + lav',
      inputLevel: '-12 dB',
      windCut: true,
    },
    checklist: [
      'Use ND filters (ND8–ND16)',
      'Place subject in shade facing open sky',
      'Monitor audio for wind',
      'Record 10s room tone',
    ],
  },
  {
    id: 'scenario-indoor-tungsten',
    title: 'Indoor Reception — Tungsten',
    environment: 'Warm venue lighting, mixed sources',
    recommendedMode: 'Manual (M)',
    camera: {
      mode: 'M',
      aperture: 'f/2–f/2.8',
      shutter: '1/50',
      iso: '1600–6400',
      whiteBalance: '3200K',
      pictureProfile: 'S-Cinetone',
    },
    audio: {
      micType: 'Wireless lav',
      inputLevel: '-15 dB',
      limiter: true,
    },
    checklist: [
      'Disable overhead AWB',
      'Watch for banding on LED walls',
      'Scout audio RF interference',
      'Bring fast prime lens',
    ],
  },
  {
    id: 'scenario-gimbal-walk',
    title: 'Gimbal Walkthrough',
    environment: 'Interior walkthrough, continuous movement',
    recommendedMode: 'Shutter Priority (S) or Manual',
    camera: {
      mode: 'S',
      shutter: '1/100',
      iso: 'Auto cap 3200',
      stabilization: 'Off (gimbal handles)',
      frameRate: '24fps',
    },
    audio: {
      micType: 'On-camera shotgun',
      windCut: false,
    },
    checklist: [
      'Balance gimbal before each location',
      'Use ND if windows blow highlights',
      'Walk heel-to-toe for smooth motion',
      'Plan start/end points',
    ],
  },
  {
    id: 'scenario-podcast-studio',
    title: 'Podcast Studio',
    environment: 'Controlled room, seated host',
    recommendedMode: 'Aperture Priority (A) or Manual',
    camera: {
      mode: 'A',
      aperture: 'f/4',
      shutter: '1/50',
      iso: '400',
      whiteBalance: '5000K',
    },
    audio: {
      micType: 'XLR dynamic or lav',
      inputLevel: '-12 dB peak',
      limiter: true,
    },
    checklist: [
      'Treat reflections behind host',
      'Frame headroom consistently',
      'Clap sync if multi-cam',
      'Record backup audio to recorder',
    ],
  },
  {
    id: 'scenario-sports-action',
    title: 'Sports / Action',
    environment: 'Fast motion, variable distance',
    recommendedMode: 'Shutter Priority (S)',
    camera: {
      mode: 'S',
      shutter: '1/500–1/1000',
      iso: 'Auto up to 12800',
      focusMode: 'AF-C tracking',
      frameRate: '60fps',
    },
    audio: {
      micType: 'Ambient / crowd optional',
      inputLevel: '-20 dB',
    },
    checklist: [
      'Use zone or wide AF tracking',
      'Pre-focus on likely action zone',
      'Use faster card (V60+)',
      'Anticipate pan direction',
    ],
  },
  {
    id: 'scenario-night-city',
    title: 'Night City B-Roll',
    environment: 'Low light, neon, handheld or tripod',
    recommendedMode: 'Manual (M)',
    camera: {
      mode: 'M',
      aperture: 'f/1.8',
      shutter: '1/50',
      iso: '1600–12800',
      pictureProfile: 'S-Cinetone',
    },
    audio: {
      micType: 'Ambient stereo optional',
    },
    checklist: [
      'Expose for highlights (neon signs)',
      'Use manual focus for predictable results',
      'Bring tripod for static shots',
      'Check noise at ISO 6400+ before committing',
    ],
  },
];

export const PRESET_STORAGE_KEY = '@alpha_creators_toolkit/presets';

export function createEmptyPreset(name: string): PresetConfig {
  const timestamp = now();
  return {
    id: `preset-${Date.now()}`,
    name,
    description: '',
    category: 'custom',
    camera: {
      mode: 'Manual (M)',
      pictureProfile: 'S-Cinetone',
      iso: '',
      shutter: '',
      aperture: '',
      whiteBalance: '',
      focusMode: '',
      stabilization: '',
      resolution: '4K',
      frameRate: '24fps',
    },
    audio: {
      inputLevel: '',
      micType: '',
      windCut: false,
      limiter: true,
      sampleRate: '48 kHz',
      bitDepth: '24-bit',
    },
    notes: '',
    tags: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function duplicatePreset(preset: PresetConfig): PresetConfig {
  const timestamp = now();
  return {
    ...preset,
    id: `preset-${Date.now()}`,
    name: `${preset.name} (Copy)`,
    category: 'custom',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
