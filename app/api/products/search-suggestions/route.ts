import { NextResponse, NextRequest } from "next/server";
import { productService } from "@/app/lib/backend/services/ProductService";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("search");

  try {
    if (search && search.trim()) {
      const rawResults = await productService.findCustom({
        select: "title, category",
        orWhere: [
          { title: { like: `%${search}%` } },
          { category: { like: `%${search}%` } },
        ],
      });

      const searchLower = search.toLowerCase();

      let unique: any= [];
       rawResults.map((result) => {
        for(const [key, value] of Object.entries(result)){
          console.log(`${key} ${value}`)
          if(value.toLocaleString().toLowerCase().includes(searchLower)){
            unique.push({value, type:key})
          }
        }
      })

      return NextResponse.json(unique);
    }
  } catch (error: any) {
    console.log(error.message);
  }
}
