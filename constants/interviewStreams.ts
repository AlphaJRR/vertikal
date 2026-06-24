import { cloudflareStreamHls } from "./homeStream";

/** JR Roberts — interview clip 2 (About page / marketing). */
export const JR_INTERVIEW_2_STREAM_ID = "c48302f9ae0cff4019c0519aefdd2ea6";

/** JR Roberts — interview clip 3 (About page / marketing). */
export const JR_INTERVIEW_3_STREAM_ID = "f8927ec99093a48580e3f6213abf8e2a";

export type InterviewStream = {
  id: string;
  streamId: string;
  label: string;
  eyebrow: string;
};

export const JR_INTERVIEW_STREAMS: InterviewStream[] = [
  {
    id: "jr-intv-2",
    streamId: JR_INTERVIEW_2_STREAM_ID,
    eyebrow: "Interview",
    label: "JR Roberts — clip 2",
  },
  {
    id: "jr-intv-3",
    streamId: JR_INTERVIEW_3_STREAM_ID,
    eyebrow: "Interview",
    label: "JR Roberts — clip 3",
  },
];

export const interviewStreamSource = (streamId: string) =>
  cloudflareStreamHls(streamId);
