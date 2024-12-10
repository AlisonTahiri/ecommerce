import { Category, Product } from "@/sanity.types";
import ProductGrid from "./ProductGrid";
import { CategorySelector } from "./ui/category-selector";

type Props = {
  products: Product[];
  categories: Category[];
  currentCategorySlug: string;
};

const ProductsView = ({ products, categories, currentCategorySlug }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="w-full sm:w-[200px]">
        <CategorySelector
          currentCategorySlug={currentCategorySlug}
          categories={categories}
        />
      </div>

      <div className="flex-1">
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default ProductsView;
