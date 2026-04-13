"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Buyer = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  state: string;
};

export function useBuyer() {
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user?.email) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("buyers")
        .select("id, full_name, email, phone, state")
        .eq("email", user.email.toLowerCase())
        .single();

      setBuyer(data);
      setLoading(false);
    }
    load();
  }, []);

  return { buyer, buyerId: buyer?.id ?? null, loading };
}