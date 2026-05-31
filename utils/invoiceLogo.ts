/**
 * Invoice logo upload + profile persistence (Supabase)
 */

import { supabase } from "../lib/supabase";
import {
  DEFAULT_INVOICE_LOGO_OPTION,
  InvoiceLogoOption,
} from "../types/invoiceLogo";

const BUCKET = "creator-assets";

export function invoiceLogoStoragePath(userId: string, ext = "png"): string {
  return `logos/${userId}/invoice-logo.${ext}`;
}

export interface InvoiceLogoSettings {
  logoOption: InvoiceLogoOption;
  creatorLogoUrl: string | null;
}

export async function getInvoiceLogoUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function loadInvoiceLogoSettings(
  userId: string,
): Promise<InvoiceLogoSettings> {
  const fallback: InvoiceLogoSettings = {
    logoOption: DEFAULT_INVOICE_LOGO_OPTION,
    creatorLogoUrl: null,
  };

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("invoice_logo_url, invoice_logo_option")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return fallback;

    const rawOption = data.invoice_logo_option as InvoiceLogoOption | null;
    const logoOption =
      rawOption === "creator" || rawOption === "none" || rawOption === "ava"
        ? rawOption
        : DEFAULT_INVOICE_LOGO_OPTION;

    const creatorLogoUrl = data.invoice_logo_url ?? null;

    if (logoOption === "creator" && !creatorLogoUrl) {
      return { logoOption: DEFAULT_INVOICE_LOGO_OPTION, creatorLogoUrl: null };
    }

    return { logoOption, creatorLogoUrl };
  } catch {
    return fallback;
  }
}

export async function saveInvoiceLogoSettings(
  userId: string,
  settings: InvoiceLogoSettings,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        invoice_logo_url: settings.creatorLogoUrl,
        invoice_logo_option: settings.logoOption,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return !error;
  } catch {
    return false;
  }
}

export async function uploadInvoiceLogoToSupabase(
  localUri: string,
  userId: string,
): Promise<string | null> {
  try {
    const fileExt = localUri.split(".").pop()?.toLowerCase() || "png";
    const filePath = invoiceLogoStoragePath(userId, fileExt);

    const response = await fetch(localUri);
    const arrayBuffer = await response.arrayBuffer();

    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      svg: "image/svg+xml",
    };
    const contentType = contentTypeMap[fileExt] || "image/png";

    const { error } = await supabase.storage.from(BUCKET).upload(filePath, arrayBuffer, {
      contentType,
      upsert: true,
    });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return publicUrlData?.publicUrl ?? null;
  } catch (error) {
    console.error("Invoice logo upload failed:", error);
    return null;
  }
}

export async function deleteInvoiceLogoFromSupabase(
  userId: string,
  logoUrl?: string | null,
): Promise<boolean> {
  try {
    const paths: string[] = [];

    if (logoUrl) {
      const marker = `/object/public/${BUCKET}/`;
      const idx = logoUrl.indexOf(marker);
      if (idx >= 0) {
        paths.push(logoUrl.slice(idx + marker.length));
      }
    }

    ["png", "jpg", "jpeg", "svg"].forEach((ext) => {
      paths.push(invoiceLogoStoragePath(userId, ext));
    });

    const uniquePaths = [...new Set(paths)];
    const { error } = await supabase.storage.from(BUCKET).remove(uniquePaths);
    return !error;
  } catch {
    return false;
  }
}
