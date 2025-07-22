import { BaseService } from "./Baseservice";
import { Product } from "../../types/Product";
import { NextRequest, NextResponse } from "next/server";

export const productService = new BaseService<Product>("products");

type ProductProps = Omit<Product, "id" | "createdAt" | "updatedAt">;

export async function addProduct(data: ProductProps) {
  try {
    const product = await productService.findCustom({
      where: { title: data.title.trim() },
    });

    if (product[0]) {
      return NextResponse.json({
        success: false,
        message: "Product with the same name exists",
      });
    }
    const newProduct = await productService.create(data);

    if (!newProduct)
      return NextResponse.json({
        success: false,
        message: "Something happened",
      });

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error: any) {
    console.log(error);
  }
}

export async function deleteProduct(id: number) {
  if (!id) {
    return NextResponse.json({ success: false, message: "Invalid Request" });
  }

  try {
    const product = await productService.findCustom({ where: { id: id } });
    if (!product[0]) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }

    const deletedProduct = await productService.delete(id);

    if (deletedProduct) {
      return NextResponse.json({
        success: true,
        message: "Product Deleted Successfully",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Something happened, Please try again...",
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ success: false, message: error.message });
  }
}

export async function updateProduct(data: ProductProps){
   const product = await productService.findCustom({
      where: { title: data.title.trim() },
    });

    if (!product[0]) {
      return NextResponse.json({
        success: false,
        message: "Product does exist",
      });
    }
}
