import { createClient } from "@/lib/supabase/server";
export type MarketingSettings = Record<string, string>;
export async function getMarketingSettings(): Promise<MarketingSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("marketing_settings").select("setting_key,setting_value");
    if (error) { console.error("Marketing settings could not be read", error.message); return {}; }
    return Object.fromEntries((data || []).map(row => [row.setting_key, row.setting_value]));
  } catch { return {}; }
}
