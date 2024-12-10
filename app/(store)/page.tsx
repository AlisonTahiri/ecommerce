import BlackFridayBanner from "@/components/BlackFridayBanner";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <div>
      <BlackFridayBanner />
      <div className="flex flex-col items-center min-h-screen">
        <ProductsView
          products={products}
          categories={categories}
          currentCategorySlug=""
        />
      </div>
    </div>
  );
}
