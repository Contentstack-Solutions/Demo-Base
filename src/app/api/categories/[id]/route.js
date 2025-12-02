import { createClient } from "@/utils/supabase/server"

export async function GET(request, { params }) {
    const supabase = await createClient()
    const { id } = await params;

    console.log("params", id)
    const { data: products, error } = await supabase.rpc(
      "get_products_by_category_with_custom_data",
      { categoryid: id}
    );
  
    if (error) {
      console.log("Error getting product:", error);
      return Response.json({ error: error }, { status: 500 });
    } else {
      return Response.json({ products: products });
    }
}