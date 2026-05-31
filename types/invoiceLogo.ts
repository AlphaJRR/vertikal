export type InvoiceLogoOption = "creator" | "ava" | "none";

export const DEFAULT_INVOICE_LOGO_OPTION: InvoiceLogoOption = "ava";

export const INVOICE_LOGO_OPTIONS: {
  value: InvoiceLogoOption;
  label: string;
}[] = [
  { value: "creator", label: "My Logo" },
  { value: "ava", label: "AVA Logo" },
  { value: "none", label: "No Logo" },
];

export const MAX_INVOICE_LOGO_BYTES = 2 * 1024 * 1024;

export const INVOICE_LOGO_ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
] as const;
