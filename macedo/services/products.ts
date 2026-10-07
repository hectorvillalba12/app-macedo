import { apiRequest } from './api';
import { Product, ProductInput } from '@/types/product';

export type ProductListResponse = {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export function listProducts(
  page = 1,
  limit = 20,
  search = '',
  active?: boolean
) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) query.set('search', search.trim());
  if (active !== undefined) query.set('active', String(active));

  return apiRequest<ProductListResponse>(
    `/api/v1/products?${query.toString()}`,
    { auth: true }
  );
}

export function createProduct(input: ProductInput) {
  return apiRequest<{ data: Product }>('/api/v1/products', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(input),
  });
}

export function updateProduct(id: string, input: Partial<ProductInput>) {
  return apiRequest<{ data: Product }>(`/api/v1/products/${id}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(input),
  });
}

export function deleteProduct(id: string) {
  return apiRequest<void>(`/api/v1/products/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}