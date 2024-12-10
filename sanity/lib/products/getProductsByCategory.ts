import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategory = async (category: string) => {
  const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
         *[_type == "product" && references(*[_type == "category" && slug.current == $category]._id)]
         | order(name asc) 
                `);

  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: {
        category,
      },
    });
    return products.data || [];
  } catch (error) {
    console.log("Error fetching products", error);
    return [];
  }
};
