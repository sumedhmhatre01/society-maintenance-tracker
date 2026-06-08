import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://zimljegwclxgqqluxdma.supabase.co";
const supabaseKey = "sb_publishable_L2QKJs31wdUrR-ht7BsiWg_p7QtPVrn";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);