export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
  statusCode?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface SearchParams extends PaginationParams {
  query?: string;
}
