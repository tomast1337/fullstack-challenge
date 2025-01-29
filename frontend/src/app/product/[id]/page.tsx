import { ProductDetail } from '@frontend/components/product/ProductDetail';
import { ProductNotFound } from '@frontend/components/product/ProductNotFound';
import { fetchProduct } from '@frontend/hooks/use-products';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  try {
    const product = await fetchProduct(id);
    return <ProductDetail product={product} />;
  } catch {
    return <ProductNotFound />;
  }
}
