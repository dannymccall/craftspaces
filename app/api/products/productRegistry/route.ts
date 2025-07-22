import { NextRequest, NextResponse } from "next/server";
import {
  authMiddleware,
  uploadToCloudinary,
  getArrayBuffer,
  checkAndRefreshToken,
} from "@/app/lib/serverFunction";
import { addProductSchema } from "@/app/lib/definitions";
import { addProduct } from "@/app/lib/backend/services/ProductService";
import { generateSystemID } from "@/app/lib/helperFunctions";
import { productService } from "@/app/lib/backend/services/ProductService";

export async function GET(req: NextRequest) {
  const _user = await checkAndRefreshToken(req);
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");
  const productId = searchParams.get("productId");

  let allProducts, ratedProducts, recentProducts;

  try {
    if (query && query.trim()) {
      let decoded = decodeURIComponent(query.trim());

      const orWhere = {
        title: `LIKE '%${decoded}%'`,
        category: `LIKE '%${decoded}%'`,
        description: `LIKE '%${decoded}%'`,
        product_id: `LIKE '%${decoded}%'`,
      };

      console.log("Universal query is: ", decoded);
      console.log("orWhere:", orWhere);

      [allProducts, recentProducts, ratedProducts] = await Promise.all([
        productService.findCustom({ orWhere }),
        productService.findCustom({
          orWhere,
          orderBy: "created_at",
          orderDir: "DESC",
        }),
        productService.findCustom({
          orWhere,
          orderBy: "quantity_bought",
          orderDir: "DESC",
        }),
      ]);

      return NextResponse.json({ allProducts, recentProducts, ratedProducts });
    }

    if (productId) {
      const product = await productService.findCustom({
        where: { product_id: productId },
      });

      if (product && product.length > 0) {
        return NextResponse.json(product[0]);
      }

      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }

   
    [allProducts, recentProducts, ratedProducts] = await Promise.all([
      productService.findCustom({}),
      productService.findCustom({
        orderBy: "created_at",
        orderDir: "DESC",
      }),
      productService.findCustom({
        orderBy: "quantity_bought",
        orderDir: "DESC",
      }),
    ]);

    return NextResponse.json({ allProducts, recentProducts, ratedProducts });
    // Default case — no query or productId
  } catch (error) {
    console.log("❌ Error in GET /api/products:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}

