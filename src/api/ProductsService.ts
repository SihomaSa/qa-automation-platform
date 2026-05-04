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
      // Validate schema — throws ZodError if API shape changes
      ProductsResponseSchema.parse(response.data)
    }
    return response
  }

  async searchProduct(query: string): Promise<ApiResponse> {
    // API requires form-encoded body, not JSON
    return apiClient.postForm('/searchProduct', { search_product: query })
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const response = await this.getAllProducts()
    return response.data.products.find((p) => p.id === id)
  }
}

export const productsService = new ProductsService()
