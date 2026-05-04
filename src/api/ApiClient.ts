import axios, { AxiosInstance, AxiosResponse } from 'axios'

export interface ApiResponse<T = unknown> {
  status: number
  data: T
  headers: Record<string, string>
  duration: number
}

export class ApiClient {
  private client: AxiosInstance

  constructor(baseURL = process.env.API_BASE_URL || 'https://automationexercise.com/api') {
    this.client = axios.create({
      baseURL,
      timeout: Number(process.env.TIMEOUT) || 30000,
      headers: {
        Accept: 'application/json',
      },
      // Don't throw on non-2xx — tests assert status codes explicitly
      validateStatus: () => true,
    })

    this.client.interceptors.request.use((config) => {
      config.headers['x-request-start'] = Date.now().toString()
      console.log(`  → ${config.method?.toUpperCase()} ${config.url}`)
      return config
    })

    this.client.interceptors.response.use((response) => {
      const start = parseInt(response.config.headers['x-request-start'] ?? '0')
      const duration = Date.now() - start
      console.log(`  ← ${response.status} (${duration}ms)`)
      return response
    })
  }

  private toApiResponse<T>(response: AxiosResponse<T>, start: number): ApiResponse<T> {
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
      duration: Date.now() - start,
    }
  }

  async get<T = unknown>(path: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const start = Date.now()
    const response = await this.client.get<T>(path, { params })
    return this.toApiResponse(response, start)
  }

  async post<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const start = Date.now()
    const response = await this.client.post<T>(path, body)
    return this.toApiResponse(response, start)
  }

  /** POST with application/x-www-form-urlencoded */
  async postForm<T = unknown>(path: string, fields: Record<string, string>): Promise<ApiResponse<T>> {
    const start = Date.now()
    const response = await this.client.post<T>(path, new URLSearchParams(fields), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return this.toApiResponse(response, start)
  }

  async put<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const start = Date.now()
    const response = await this.client.put<T>(path, body)
    return this.toApiResponse(response, start)
  }

  async delete<T = unknown>(path: string): Promise<ApiResponse<T>> {
    const start = Date.now()
    const response = await this.client.delete<T>(path)
    return this.toApiResponse(response, start)
  }
}

export const apiClient = new ApiClient()
