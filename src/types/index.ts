import { Request } from 'express';

// Standard API response shape
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Query params for product listing
export interface ProductQueryParams {
  page?: string;
  limit?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  isFeatured?: string;
  isNewArrival?: string;
  isBestSeller?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

// Express request with typed params/query
export interface TypedRequest<TBody = unknown, TQuery = unknown> extends Request {
  body: TBody;
  query: TQuery & Record<string, string | string[] | undefined>;
}
