import { supabase } from "../config/supabase.js";

const {
  data: { session }
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "index.html";
}