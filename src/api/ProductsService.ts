import { z } from 'zod'
import { apiClient, ApiResponse } from './ApiClient'

// --- Schemas ---
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  brand: z.string(),
  category: z.object({
    usertype: z.object({ usertype: z.string() }),
    category: z.string(),
  }),
})

export const ProductsResponseSchema = z.object({
  responseCode: z.number(),
  products: z.array(ProductSchema),
})

export type Product = z.infer<typeof ProductSchema>
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>

// --- Service ---
export class ProductsService {
  async getAllProducts(): Promise<ApiResponse<ProductsResponse>> {
    const response = await apiClient.get<ProductsResponse>('/productsList')
    if (response.status === 200) {
      ProductsResponseSchema.parse(response.data) // throws if schema mismatch
    }
    return response
  }

  async searchProduct(query: string): Promise<ApiResponse> {
    const formData = new URLSearchParams({ search_product: query })
    return apiClient.post('/searchProduct', formData.toString())
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const response = await this.getAllProducts()
    return response.data.products.find((p) => p.id === id)
  }
}

export const productsService = new ProductsService()
