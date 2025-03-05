"use server"
import { encodedRedirect } from "@/utils/encode-redirect";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = await createClient();
  
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      return encodedRedirect("error", "/sign-in", error.message);
    }
  
    return redirect("/admin/dashboard");
  };

  
export const signInWithOAuthAction = async () => {
    const supabase = await createClient();
    const provider = "google";
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?redirectTo=${encodeURIComponent("/admin/dashboard")}`;
    const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo,
        },
    });
    if (error) {
        return encodedRedirect("error", "/sign-in", error.message); 
        }
};


export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
  };
  