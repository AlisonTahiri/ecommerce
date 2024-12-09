import { Category, Product } from "@/sanity.types";
import ProductGrid from "./ProductGrid";

type Props = {
  products: Product[];
  categories: Category[];
};

const ProductsView = ({ products, categories }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="w-full sm:w-[200px]">
        {/* <CategorySelectorComponent categories={categories} /> */}
      </div>

      <div className="flex-1">
        <ProductGrid products={products} />
        <hr className="w-1/2 sm:w-3/4" />
      </div>
    </div>
  );
};

export default ProductsView;
