import { supabase } from "../config/supabase.js";

console.log("Supabase Connected:", supabase);

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("Login clicked");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    console.log("Response:", data);
    console.log("Error:", error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Login Successful!");

    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Unexpected error. Check console.");
  }
});