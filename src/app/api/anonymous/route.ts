import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const { error } = await supabase
      .from("anonymous_messages")
      .insert([{ message }]);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}