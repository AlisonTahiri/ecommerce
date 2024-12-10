import { imageUrl } from "@/lib/imageUrl";
import { cn } from "@/lib/utils";
import { getProductBySlug } from "@/sanity/lib/products/getProductBySlug";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { notFound } from "next/navigation";

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  const isOutOfStock = product?.stock != null && product?.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={cn(
            "relative aspect-square overflow-hidden rounded-lg shadow-lg",
            { "opacity-50": isOutOfStock }
          )}
        >
          {product.image && (
            <Image
              src={imageUrl(product.image).url()}
              alt={product.name || "Product Image"}
              fill
              className="object-contain transition-transform duration-300 hover:scale-105"
              priority
            />
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <p className="text-white text-lg font-bold">Out of Stock</p>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl font-semibold mb-4">
            ${product.price?.toFixed(2)}
          </p>
          <p className="text-gray-600 mb-4 italic">{product.stock} in stock</p>

          <div className="prose max-w-none mb-6">
            {Array.isArray(product.description) && (
              <PortableText value={product.description} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
