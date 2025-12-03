import { createClient } from "@/utils/supabase/server";

export async function GET(request, { params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: category, error } = await supabase
    .from("categories")
    .select("id, name, description, url")
    .eq("url", id);

  if (error) {
    console.log("Error getting product:", error);
    return Response.json({ error: error }, { status: 500 });
  } else {
    return Response.json({ category: category });
  }
}

