import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types/api'
import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const authStore = useAuthStore()
        const token = authStore.token

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const authStore = useAuthStore()

        if (error.response) {
          const status = error.response.status
          const errorData = error.response.data

          switch (status) {
            case 401:
              console.error('Unauthorized access - logging out')
              await authStore.logout()
              
              if (typeof window !== 'undefined') {
                window.location.href = '/login'
              }
              break

            case 403:
              console.error('Forbidden access')
              this.showErrorMessage(
                errorData?.message || 'You do not have permission to perform this action.'
              )
              break

            case 404:
              console.error('Resource not found')
              this.showErrorMessage(
                errorData?.message || 'The requested resource was not found.'
              )
              break

            case 500:
              console.error('Server error')
              this.showErrorMessage(
                'An internal server error occurred. Please try again later.'
              )
              break

            default:
              console.error(`HTTP ${status} error:`, errorData?.message)
              if (errorData?.message) {
                this.showErrorMessage(errorData.message)
              }
          }
        } else if (error.request) {
          console.error('Network error - no response received')
          this.showErrorMessage(
            'Network error. Please check your connection and try again.'
          )
        } else {
          console.error('Request setup error:', error.message)
          this.showErrorMessage('An unexpected error occurred.')
        }

        return Promise.reject(error)
      }
    )
  }

  private showErrorMessage(message: string): void {
    if (typeof window !== 'undefined') {
      alert(message)
    }
  }

  getClient(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new ApiClient().getClient()
