import React from "react";
import Category from "@/app/ui/Shop/Category";

const page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const category = (await params).category;
  console.log(category);
  return <Category category={category} />;
};

export default page;
